import { HELPDESK } from "./helpdesk";
import { HELPDESK2 } from "./helpdesk2";
import { HELPDESK3 } from "./helpdesk3";
import { SOC } from "./soc";
import { HANDSON } from "./handson";
import type { Scenario } from "./types";

export type Role = {
  id: string;
  title: string;
  blurb: string;
  /** What the job actually is, in plain words, for someone who has never held it. */
  about: string;
  scenarios: Scenario[];
  /** Roles with no scenarios yet are shown honestly as "planned". */
  planned?: boolean;
};

const order = { beginner: 0, intermediate: 1, advanced: 2 } as const;
const byLevel = (a: Scenario[]) => [...a].sort((x, y) => order[x.difficulty] - order[y.difficulty]);

export const ROLES: Role[] = [
  {
    id: "help-desk",
    title: "IT Help Desk",
    blurb: "Tier 1 and 2 support: accounts, devices, networks, printers and people.",
    about: "Help desk technicians are the first point of contact when technology breaks. You answer calls, chats and tickets, verify who you are helping, diagnose problems step by step, fix what you can, escalate what you can't, and document everything.",
    scenarios: byLevel([...HELPDESK, ...HELPDESK2, ...HELPDESK3, ...HANDSON.filter((x) => x.kind === "helpdesk")]),
  },
  {
    id: "soc-analyst",
    title: "SOC Analyst",
    blurb: "Triage security alerts, search logs and respond to incidents.",
    about: "A Security Operations Center (SOC) analyst watches alerts from security tools, decides which are real, investigates with log searches, helps contain attacks and writes up what happened. Tier 1 triages, Tier 2 investigates deeper.",
    scenarios: byLevel([...SOC, ...HANDSON.filter((x) => x.kind === "soc")]),
  },
  { id: "sysadmin", title: "Systems Administrator", blurb: "Servers, users, patching and backups.", about: "Planned: user and group management, patching, backups and server troubleshooting.", scenarios: [], planned: true },
  { id: "network-tech", title: "Network Technician", blurb: "Switches, routers, DHCP, DNS and firewalls.", about: "Planned: cabling, addressing, VLANs and firewall rules.", scenarios: [], planned: true },
  { id: "grc", title: "GRC / Compliance Analyst", blurb: "Policies, risk and audits.", about: "Planned: mapping controls to frameworks and finding audit gaps.", scenarios: [], planned: true },
];

export const roleById = (id: string) => ROLES.find((r) => r.id === id);
export const ALL_SCENARIOS: Scenario[] = ROLES.flatMap((r) => r.scenarios);
