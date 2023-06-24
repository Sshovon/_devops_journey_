# Vagrant
Vagrant is an open-source tool that allows you to create, configure, and manage boxes of virtual machines through an easy to use command interface. To initiate a virtual machine we need to use the gui of virtualbox or other virtualization application. Using vagrant we can initiate virtual machine from the terminal by using the Vagrantfile. Vagrantfile is mainly a configuration file written in ruby which will help to initiate the virtual machine.

I am using ubuntu22.04 as my host machine.
### Pre-requisite installation
* Virtualization application (virtualbox, virt-manager etc)
* Vagrant 

### Virtualbox
```
 sudo apt update && sudo apt upgrade
```
```
 sudo apt install virtualbox -y
```
Now, we need to install virtualbox extension package. 
```
 wget https://download.virtualbox.org/virtualbox/6.1.32/Oracle_VM_VirtualBox_Extension_Pack-6.1.32.vbox-extpack
```
```
sudo VBoxManage extpack install Oracle_VM_VirtualBox_Extension_Pack-6.1.32.vbox-extpack
```
Our virtualbox is ready to go.

### Vagrant
```
sudo apt install vagrant -y
```
Check vagrant version,
```
 vagrant --version
```

### Create vm using vagrant
```
mkdir anything-you-want && cd anything-you-want
```
Lets create a Vagrantfile. Following command will create a vm configuration file of ubuntu18.04. hashicorp/bionic64 defines the image of ubuntu18.04 bionic defined in vagrant cloud. Check [Vagrant Cloud](https://app.vagrantup.com/boxes/search) for more.

```
vagrant init ubuntu/bionic64
```
Now we can see a Vagrantfile in anything-you-want directory. Let's start the vm. It will take some time to fetch the image from cloud and initialize it. Hold tight. 

```
vagrant up
```
Now, if you check virtualbox you will see a new virtual machine is running. We can enter the virtual machine using the terminal.

```
vagrant ssh
```
If, we want to shut down the virtual machine, we can run following command.

```
vagrant halt
```
If, we want to remove the virtual machine with all it's trace, we can run following command.

```
vagrant destroy
```
