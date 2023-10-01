
# TCPDUMP

Tcpdump is a command-line network packet analyzer utility used in Unix-like operating systems (e.g., Linux, macOS) to capture and analyze network traffic. It allows users to monitor and inspect the data packets flowing through a network interface, providing insights into network activity, troubleshooting network issues, and diagnosing network-related problems. It sounds quite a bit similar to Wireshark which is widely known for it's user-friendly gui. They both serve similar purpose but have different capabilites.  Wireshark is a graphical network protocol analyzer with advanced analysis features and support for multiple platforms. And tcpdump is a command-line packet analyzer for capturing and filtering packets on Unix-like systems. 

## Keyword Explanation

**Interface** A network interface is a connection point on a device that enables communication and data exchange with a network. Network interfaces can be physcial, like Ethernet port or Wifi adapters, or they can be virtual created through software, like virtual ethernet adapter. Each network interface has it's unique MAC address, which helps to distinguish the device from others on the local network. 


## Getting Started
We need to use tcpdump with administrative privileges to provide the capabilities to capture raw packets and analyze them. 

```
$ sudo tcpdump --list-interfaces 
1.wlp0s20f3 [Up, Running, Wireless, Associated]
2.any (Pseudo-device that captures on all interfaces) [Up, Running]
3.lo [Up, Running, Loopback]
4.enp3s0 [Up, Disconnected]
5.br-2ebe8b1e5a57 [Up, Disconnected]
7.docker0 [Up, Disconnected]
8.br-134385f95a03 [Up, Disconnected]
```
This will list all interfaces avaiable in our local machine. We can select any interface to specifically observe packets flowing through that interface.


```
sudo tcpdump -i any 
```
This will start logging incoming and outgoing packets in the terminal. We can also specify any interface available from our local machine to make a custom filtering of network traffic (e.g., wlp0s20f3 or lo ). We can use ctrl+c to stop capturing packet. We can also use  -c to limit the count.

```
sudo tcpdump -i <interface_name> -c 10
```
This will capture first 10 packets incoming-outgoing from the traffic. 