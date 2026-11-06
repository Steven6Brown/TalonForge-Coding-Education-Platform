import type { FsDef } from "@/lib/shell/vfs";

/** A fictional packet-list export (like the table view in Wireshark/CloudShark). Private/documentation IPs only. */
export const pcap: FsDef = {
  "/home/student/README.txt":
    "Packet analysis drill. ~/capture2.txt is a packet list export (No., Time, Source, Destination, Protocol, Info).\nAnswer (one at a time):\n  1. Which IP address is the DNS server the client queried?\n  2. What HTTP response code did the web server send back?\n  3. Which page path did the client request with HTTP GET?\nTry: grep DNS capture2.txt | grep -i 'query A'  and  grep HTTP capture2.txt\n",
  "/home/student/capture2.txt":
    [
      "No.  Time   Source            Destination       Protocol Info",
      "1    0.000  192.168.88.142    192.168.88.1      ARP      Who has 192.168.88.1? Tell 192.168.88.142",
      "2    0.001  192.168.88.1      192.168.88.142    ARP      192.168.88.1 is at 00:22:55:56:69:90",
      "3    0.010  192.168.88.142    10.20.0.53        DNS      Standard query A shop.example.com",
      "4    0.030  10.20.0.53        192.168.88.142    DNS      Standard query response A 203.0.113.80",
      "5    0.040  192.168.88.142    203.0.113.80      TCP      49152 > 80 [SYN]",
      "6    0.060  203.0.113.80      192.168.88.142    TCP      80 > 49152 [SYN, ACK]",
      "7    0.061  192.168.88.142    203.0.113.80      TCP      49152 > 80 [ACK]",
      "8    0.070  192.168.88.142    203.0.113.80      HTTP     GET /deals/index.html HTTP/1.1",
      "9    0.120  203.0.113.80      192.168.88.142    HTTP     HTTP/1.1 200 OK",
      "10   0.300  192.168.88.1      Broadcast         ARP      Who has 192.168.88.216? Tell 192.168.88.1",
    ].join("\n") + "\n",
};
