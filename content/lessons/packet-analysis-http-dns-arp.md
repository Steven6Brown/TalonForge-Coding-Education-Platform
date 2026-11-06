## Reading a packet list

Tools like **Wireshark** and **CloudShark** show captured traffic as a table: packet number, time, source, destination, protocol and a summary. Learning to read it means following the story one protocol at a time.

## ARP: who has this IP?

Within a local network, devices send frames to **MAC addresses**, not IPs. **ARP** (Address Resolution Protocol) maps an IP to a MAC.

- *Request:* "Who has 192.168.88.1? Tell 192.168.88.142." It is sent to the **broadcast** address (`ff:ff:ff:ff:ff:ff`) because the sender doesn't know the target's MAC yet.
- *Reply:* "192.168.88.1 is at 00:22:55:56:69:90."

## DNS: name to address

A client asks its configured DNS server to resolve a name (query), and the server answers with an address (response). The query's **destination** is the DNS server.

## TCP: the handshake

`SYN`, then `SYN, ACK`, then `ACK`, and the connection is established.

## HTTP: the request and response

`GET /deals/index.html HTTP/1.1` asks for a page. The response begins with a **status code**:

- **200 OK**: success
- **301/302**: redirect
- **403**: forbidden, **404**: not found
- **500**: server error

## Method

1. Find the first packet of the conversation you care about.
2. Note source and destination IPs (and ports).
3. Follow the protocol steps in order, and note anything out of place.

## Your task

Use `grep` on the packet list to answer three questions about the DNS server, the HTTP status and the requested page.
