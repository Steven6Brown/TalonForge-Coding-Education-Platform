import type { Cmd } from "@/lib/shell/shell";
import { makeKaliCommands } from "@/lib/shell/kali";
import { makeHostSecCommands } from "@/lib/shell/hostsec";
import { makeRangeCommands } from "@/lib/shell/range";
import { KALI_NET } from "./filesystems-kali";
import { RANGE_MACHINES } from "./filesystems-range";

/** A terminal profile adds themed commands and a prompt host name to a lab filesystem. */
export type Profile = {
  host: string;
  intro: string;
  /** Called once per terminal so stateful tools (firewall, services) start fresh. */
  build: () => { commands: Record<string, Cmd>; help: Record<string, string> };
};

export const PROFILES: Record<string, Profile> = {
  kali: {
    host: "kali",
    intro:
      "TalonForge Kali-style lab (SIMULATED tools, fictional network 10.10.10.0/29). Type 'help' to see tools.\nNot real Kali: install Kali in an isolated VM for real practice.\n",
    build: () => makeKaliCommands(KALI_NET),
  },
  hostsec: {
    host: "server01",
    intro: "Linux host security lab (SIMULATED server). Read ~/README.txt. Privileged commands need sudo. Type 'help'.\n",
    build: () => makeHostSecCommands(),
  },
  range: {
    host: "workstation",
    intro: "Cyber range (SIMULATED machines). Read ~/README.txt, then try: ssh student@web01\n",
    build: () => makeRangeCommands(RANGE_MACHINES),
  },
};
