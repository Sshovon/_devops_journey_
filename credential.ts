// I am assuming that we have three different entities Issuer, Holder and Verifier.
async function generateProofs(useMongoStore = false) {
    console.log('=============== generate proofs ===============');
  
    let dataStorage, credentialWallet, identityWallet;
    if (useMongoStore) {
      ({ dataStorage, credentialWallet, identityWallet } = await initMongoDataStorageAndWallets(
        defaultNetworkConnection
      ));
    } else {
      ({ dataStorage, credentialWallet, identityWallet } = await initInMemoryDataStorageAndWallets(
        defaultNetworkConnection
      ));
    }
  
    const circuitStorage = await initCircuitStorage();
    const proofService = await initProofService(
      identityWallet,
      credentialWallet,
      dataStorage.states,
      circuitStorage
    );
  
    const { did: userDID, credential: authBJJCredentialUser } = await identityWallet.createIdentity({
      ...defaultIdentityCreationOptions
    });
  
    console.log('=============== user did ===============');
    console.log(userDID.string());
  
    const { did: issuerDID, credential: issuerAuthBJJCredential } =
      await identityWallet.createIdentity({ ...defaultIdentityCreationOptions });
  
    const credentialRequest = createKYCAgeCredential(userDID);
    const credential = await identityWallet.issueCredential(issuerDID, credentialRequest);
    
    // Assumption: Credential is stored in the holder's wallet.
    await dataStorage.credential.saveCredential(credential);
  
    console.log('================= generate Iden3SparseMerkleTreeProof =======================');
  
    // QUESTION: Is addCredentialsToMerkleTree is required to generate only MT proofs? If I consider only Sig proofs, then I can skip this step right?
    // Also this step will be performed by the Issuers. So does the issuer need to perform it after each credential issuance?
    const res = await identityWallet.addCredentialsToMerkleTree([credential], issuerDID);
  
    console.log('================= push states to rhs ===================');
  
    // QUESTION: If if I am using Sig proofs, then do I need to push states to RHS?
    // I am asuming that I need to push RHS doesn't have any relation with the MT/Sig proofs. It's for checking revocation status.
    // QUESTION: If I revoke any credential, then do I need to perform publishStateToRHS afterward? Also publish RHS state and addCredentialsToMerkleTree are two independent steps?

    await identityWallet.publishStateToRHS(issuerDID, rhsUrl);
  
    // QUESTION: publishing is blockchain is required for only on-chain issuance or for off-chain issuance as well?
    // I am assuming that this step is connected with the MT proofs. Correct me if I am wrong. 
    console.log('================= publish to blockchain ===================');
    const ethSigner = new ethers.Wallet(walletKey, (dataStorage.states as EthStateStorage).provider);
    const txId = await proofService.transitState(
      issuerDID,
      res.oldTreeState,
      true,
      dataStorage.states,
      ethSigner
    );
    console.log(txId);

    console.log('================= generate credentialAtomicSigV2 ===================');
  
    // On the verifier end, the verifier will request the holder to provide a proof of the credential. 
    const proofReqSig: ZeroKnowledgeProofRequest = createKYCAgeCredentialRequest(
      CircuitId.AtomicQuerySigV2,
      credentialRequest
    );
    // holder is generating proof for the requested credential.
    const { proof, pub_signals } = await proofService.generateProof(proofReqSig, userDID);
        
    // verifier is verifying the proof.
    const sigProofOk = await proofService.verifyProof(
      { proof, pub_signals },
      CircuitId.AtomicQuerySigV2
    );
    console.log('valid: ', sigProofOk);
  
    console.log('================= generate credentialAtomicMTPV2 ===================');
    // QUESTION: What is the purpose of this step?  Who is performing this step? Verifier or Issuer or Holder? If this step is not performed by the Issuer,
    // then how the verifier or holder getting the txId?
    const credsWithIden3MTPProof = await identityWallet.generateIden3SparseMerkleTreeProof(
      issuerDID,
      res.credentials,
      txId
    );
    console.log(credsWithIden3MTPProof);
    await credentialWallet.saveAll(credsWithIden3MTPProof);
  
    // Creating a proof request for the MTP proof.
    const proofReqMtp: ZeroKnowledgeProofRequest = createKYCAgeCredentialRequest(
      CircuitId.AtomicQueryMTPV2,
      credentialRequest
    );
    // holder is generating proof for the requested credential.
    const { proof: proofMTP } = await proofService.generateProof(proofReqMtp, userDID);
  
    console.log(JSON.stringify(proofMTP));
    // verifier is verifying the proof.
    const mtpProofOk = await proofService.verifyProof(
      { proof, pub_signals },
      CircuitId.AtomicQueryMTPV2
    );
    console.log('valid: ', mtpProofOk);
      
    // QUESTION: Is there any specific reason to check the sig based proof again or it's random testing? 
    const { proof: proof2, pub_signals: pub_signals2 } = await proofService.generateProof(
      proofReqSig,
      userDID
    );
  
    const sigProof2Ok = await proofService.verifyProof(
      { proof: proof2, pub_signals: pub_signals2 },
      CircuitId.AtomicQuerySigV2
    );
    console.log('valid: ', sigProof2Ok);
  }