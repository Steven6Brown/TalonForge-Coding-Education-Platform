## Wi-Fi security

- **WEP** is broken; never use it. **WPA2-AES** with a long passphrase is acceptable; **WPA3** is preferred.
- Enterprises use **WPA2/WPA3-Enterprise (802.1X)** so each user authenticates individually.
- Turn off **WPS**, change default router credentials, update firmware, and separate guest networks from internal ones.
- A **rogue access point** or "evil twin" imitates a real network to trick users. Wireless monitoring and certificate validation help.

## Bluetooth

Bluetooth is a short-range protocol used by headsets, keyboards, cars and IoT devices. Risks include weak pairing, outdated implementations with known flaws, and devices left discoverable.

Defenses:

- Turn Bluetooth off when unused and keep it non-discoverable
- Update device firmware and operating systems
- Avoid pairing in public places; remove old pairings
- Don't accept unexpected pairing requests

## Think like a defender

Wireless traffic travels through the air, so anyone nearby can try to listen. Encryption, authentication and good configuration are what protect it. Assess your own devices; never test networks or devices you don't own or lack permission to test.

## Check yourself

Take the quiz below.

## Key facts this lesson's quiz checks

- **Why public Wi-Fi is riskier.** On an open or shared network, other people on the same network may **observe or tamper with unencrypted traffic**, and attackers can set up lookalike hotspots. Use **HTTPS everywhere** (it encrypts the connection to the site) and a **VPN** when you cannot trust the network.

## Worked examples: wireless risks and the fix

**Scenario 1: coffee-shop Wi-Fi.** You connect to "CafeFreeWiFi". Two risks:

- Anyone on the same network may be able to **watch or tamper with unencrypted traffic**.
- An attacker can run a fake hotspot with a convincing name (an **evil twin**), so all your traffic passes through them.

**What protects you:** **HTTPS** everywhere (the padlock: the connection to the site is encrypted even if the Wi-Fi is not) and a **VPN** that wraps all your traffic in an encrypted tunnel.

**Scenario 2: home Wi-Fi settings.** A safe setup: **WPA2 or WPA3** with a long unique passphrase, a changed default router admin password, firmware updates, and WPS (the push-button setup feature) turned off. Old **WEP** and open networks are insecure.

**Scenario 3: Bluetooth.** Devices that are **discoverable** and accept pairing from anyone can be abused. Keep Bluetooth off when you do not need it, set devices to non-discoverable, accept only pairings you started, and update the firmware.

## Why wireless is different

The signal travels through the air, so anyone nearby can try to listen or connect without touching a cable. Security therefore depends on **encryption and strong authentication**, not on physical access.

## Self-check

1. Which setting is safest for Wi-Fi? (WPA3, or WPA2 with a strong passphrase.)
2. What does a VPN protect on public Wi-Fi? (Your traffic in transit, with an encrypted tunnel.)
3. Why disable WPS? (It has known weaknesses that make the network easier to break into.)
