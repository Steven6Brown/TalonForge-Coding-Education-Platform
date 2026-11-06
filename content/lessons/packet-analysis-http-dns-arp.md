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

## New to the terminal? Commands you will use

The capture is a plain text file. You will search it with `grep`.

- `cat capture2.txt` prints the whole file (it is long, so searching is better).
- `grep DNS capture2.txt` shows only the lines that contain the word `DNS`. The first word after `grep` is what you are looking for; the second is the file.
- `grep -i http capture2.txt` ignores upper and lower case.
- `grep "GET" capture2.txt` shows web page requests (quotes are needed if the search text has spaces).

## Worked approach

1. DNS: `grep DNS capture2.txt`. A **query** goes from the client **to** the DNS server, so the DNS server's address is the **destination** of the query line.
2. HTTP status: `grep HTTP capture2.txt`. Find the response line; the three-digit number after `HTTP/1.1` is the status code.
3. Page requested: find the `GET` line and read the path right after `GET`.
