KEY_FILE:=auth.json
PROJECT_ID:=charged-shuttle-397417


# Login gcp
gcloud_login:
	@ gcloud auth activate-service-account --key-file=${KEY_FILE}

# Selecting project available from your account
gcloud_set:
	@ gcloud config set project ${PROJECT_ID}

# Listing avaiable resources

gcloud_list_network:
	@ gcloud compute networks list
 

gcloud_describe_network:
	@ gcloud compute networks describe ${VPC}


# VPC
VPC:= my-vpc
SUBNET_MODE:= custom

# create vpc
gcloud_create_vpc:
	@ gcloud compute networks create ${VPC} --subnet-mode=${SUBNET_MODE}


# SUBNET
PROXY_SUBNET:=proxy-subnet
PROXY_SUBNET_CIDR:=10.102.0.0/24

BE_SUBNET=backend-subnet
BE_SUBNET_CIDR:=10.101.0.0/24

FE_SUBNET=frontend-subnet
FE_SUBNET_CIDR:=10.103.0.0/24

DB_SUBNET=db-subnet
DB_SUBNET_CIDR:=10.104.0.0/24

REGION:=us-west1
ZONE:=us-west1-a


# create subnet S3
gcloud_create_subnet_s3:
	@ gcloud compute networks subnets create ${PROXY_SUBNET} --network=${VPC} --range=${PROXY_SUBNET_CIDR} --region=${REGION}

# create subnet backend
gcloud_create_subnet_be:
	@ gcloud compute networks subnets create ${BE_SUBNET} --network=${VPC} --range=${BE_SUBNET_CIDR} --region=${REGION}

# create subnet frontend
gcloud_create_subnet_fe:
	@ gcloud compute networks subnets create ${FE_SUBNET} --network=${VPC} --range=${FE_SUBNET_CIDR} --region=${REGION}

# create subnet database
gcloud_create_subnet_db:
	@ gcloud compute networks subnets create ${DB_SUBNET} --network=${VPC} --range=${DB_SUBNET_CIDR} --region=${REGION}


# listing available subnets
gcloud_list_subnet:
	@ gcloud compute networks subnets list

#create all subnet
gcloud_create_subnet_all: gcloud_create_subnet_proxy gcloud_create_subnet_be gcloud_create_subnet_fe gcloud_create_subnet_db


# Create VM Instances

MACHINE_TYPE:=e2-standard-2
PUB_KEY_CONTENT := $(shell cat devcon.pub)

# create vm instance for proxy server
PROXY_INSTANCE:=proxy-vm
PROXY_TAG:=proxy
gcloud_create_proxy_vm:
	@ gcloud compute instances create ${PROXY_INSTANCE} \
		--project=${PROJECT_ID} \
    	--machine-type=${MACHINE_TYPE} \
		--image-family=debian-10 \
		--image-project=debian-cloud \
		--boot-disk-size=10GB \
		--subnet=${PROXY_SUBNET} \
		--zone=${ZONE} \
		--metadata="ssh-keys=frcs:${PUB_KEY_CONTENT}"  \
		--network=${VPC} \
		--tags=${PROXY_TAG} 


# create vm instance for backend-1
BE_INSTANCE_1:=be-vm-1
BE_TAG:=be

gcloud_create_backend_vm_1:
	@ gcloud compute instances create ${BE_INSTANCE_1} \
		--project=${PROJECT_ID} \
    	--machine-type=${MACHINE_TYPE} \
		--image-family=debian-10 \
		--image-project=debian-cloud \
		--boot-disk-size=10GB \
		--subnet=${BE_SUBNET} \
		--zone=${ZONE} \
		--metadata="ssh-keys=frcs:${PUB_KEY_CONTENT}"  \
		--network=${VPC} \
		--tags=${BE_TAG} \
		--no-address 

# create vm instance for backend-2

BE_INSTANCE_2:=be-vm-2
BE_TAG:=be
gcloud_create_backend_vm_2:
	@ gcloud compute instances create ${BE_INSTANCE_2} \
		--project=${PROJECT_ID} \
    	--machine-type=${MACHINE_TYPE} \
		--image-family=debian-10 \
		--image-project=debian-cloud \
		--boot-disk-size=10GB \
		--subnet=${BE_SUBNET} \
		--zone=${ZONE} \
		--metadata="ssh-keys=frcs:${PUB_KEY_CONTENT}"  \
		--network=${VPC} \
		--tags=${BE_TAG} \
		--no-address 


# create vm for database
DB_INSTANCE:=db-vm
DB_TAG:=db

gcloud_create_database_vm:
	@ gcloud compute instances create ${DB_INSTANCE} \
		--project=${PROJECT_ID} \
    	--machine-type=${MACHINE_TYPE} \
		--image-family=debian-10 \
		--image-project=debian-cloud \
		--boot-disk-size=10GB \
		--subnet=${DB_SUBNET} \
		--zone=${ZONE} \
		--metadata="ssh-keys=frcs:${PUB_KEY_CONTENT}"  \
		--network=${VPC} \
		--tags=${DB_TAG} \
		--no-address 


# create vm for front-end
FE_INSTANCE:=fe-vm
FE_TAG:=fe

gcloud_create_frontend_vm:
	@ gcloud compute instances create ${FE_INSTANCE} \
		--project=${PROJECT_ID} \
    	--machine-type=${MACHINE_TYPE} \
		--image-family=debian-10 \
		--image-project=debian-cloud \
		--boot-disk-size=10GB \
		--subnet=${FE_SUBNET} \
		--zone=${ZONE} \
		--metadata="ssh-keys=frcs:${PUB_KEY_CONTENT}"  \
		--network=${VPC} \
		--tags=${FE_TAG} \
		--no-address 	


# CLOUD ROUTER
ROUTER_NAME:=my-router
gcloud_create_router:
	@ gcloud compute routers create ${ROUTER_NAME} --region=${REGION} --network=${VPC}

# CLOUD NAT
NAT_NAME:=my-nat
gcloud_create_nat:
	@ gcloud compute routers nats create ${NAT_NAME} \
		--router=${ROUTER_NAME} \
		--region=${REGION} \
		--nat-all-subnet-ip-ranges \
		--auto-allocate-nat-external-ips

# Cloud NAT list
gcloud_cloud_nat_list:
	@ gcloud compute routers nats list --region=${REGION} --router=${ROUTER_NAME}


# IAP allow ingress Firewall rule
# Only applied to vm's with private tag
gcloud_allow_rdp_ingress_3389:
	@ gcloud compute firewall-rules create allow-rdp-ingress-from-iap \
		--direction=INGRESS \
		--action=allow \
		--rules=tcp:3389 \
		--source-ranges=35.235.240.0/20 \
		--target-tags=${BE_TAG},${FE_TAG},${DB_TAG}

# Only applied to vm's with private tag
gcloud_allow_ssh_ingress_22:
	@ gcloud compute firewall-rules create allow-ssh-ingress-from-iap \
		--direction=INGRESS \
		--action=allow \
		--rules=tcp:22 \
		--source-ranges=35.235.240.0/20 \
		--target-tags=${BE_TAG},${FE_TAG},${DB_TAG}


gcloud_allow_ingress_on_DB_port_3306_from_backends:
	@ gcloud compute firewall-rules create allow-ingress-db-from-backends \
		--direction=INGRESS \
		--action=allow \
		--rules=tcp:3306 \
		--source-ranges=${BE_SUBNET_CIDR} \
		--target-tags=${DB_TAG} \
		--network=${VPC}

gcloud_allow_ingress_on_FE_BE_port_3000_from_proxy_subnet:
	@ gcloud compute firewall-rules create allow-ingress-fe-from-proxy-subnet \
		--direction=INGRESS \
		--action=allow \
		--rules=tcp:3000 \
		--source-ranges=${PROXY_SUBNET_CIDR} \
		--target-tags=${FE_TAG},${BE_TAG} \
		--network=${VPC}

ANY_IP:=0.0.0.0/0
gcloud_allow_ingress_on_PROXY_VM_port_80_http_from_all:
	@ gcloud compute firewall-rules create allow-ingress-proxy-vm-port-80-http-from-all \
		--direction=INGRESS \
		--action=allow \
		--rules=tcp:80 \
		--source-ranges=${ANY_IP} \
		--target-tags=${PROXY_TAG} \
		--network=${VPC}
gcloud_allow_ingress_on_PROXY_VM_port_443_https_from_all:
	@ gcloud compute firewall-rules create allow-ingress-proxy-vm-port-443-http-from-all \
		--direction=INGRESS \
		--action=allow \
		--rules=tcp:80 \
		--source-ranges=${ANY_IP} \
		--target-tags=${PROXY_TAG} \
		--network=${VPC}

# Execute all firewall rules mentioed previously using one call
create_firewall_rules:
	@ $(MAKE) gcloud_allow_ingress_3389
	@ $(MAKE) gcloud_allow_ingress_22
	@ $(MAKE) gcloud_allow_ingress_on_DB_port_3306_from_backends
	@ $(MAKE) gcloud_allow_ingress_on_FE_BE_port_3000_from_proxy_subnet
	@ $(MAKE) gcloud_allow_ingress_on_PROXY_VM_port_80_http_from_all
	@ $(MAKE) gcloud_allow_ingress_on_PROXY_VM_port_443_https_from_all
print_pubKey:
	@ echo ${PUB_KEY_CONTENT}

gcloud_instance_list:
	@ gcloud compute instances list

PD_NAME:=pd-1
PD_TYPE:=pd-standard
PD_SIZE:=10GB
PD_ZONE:=us-west1-a
PD_POLICY:=projects/${PROJECT_ID}/regions/us-west1/resourcePolicies/default-schedule-1
gcloud_create_persistent_disk:
	@ gcloud compute disks create ${PD_NAME} \
		--project=${PROJECT_ID} \
		--type=${PD_TYPE} \
		--size=${PD_SIZE} \
		--resource-policies=${PD_POLICY} \
		--zone=${PD_ZONE}

INSTANCE_NAME:=${DB_INSTANCE}
gcloud_attach_persistent_disk:
	@ gcloud compute instances attach-disk ${INSTANCE_NAME} \
		--disk ${PD_NAME}

gcloud_check_persistent_disk_user:
	@ gcloud compute disks list --filter="users:${INSTANCE_NAME}"


