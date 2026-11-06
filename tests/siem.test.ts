import { describe, expect, it } from "vitest";
import { QueryError, runQuery } from "@/lib/siem/engine";
import { EVENTS, TRUTH } from "@/lib/siem/data";

const q = (s: string) => runQuery(s, EVENTS);

describe("mini SIEM engine", () => {
  it("filters with field=value, wildcards, NOT and OR", () => {
    expect(q("source=auth action=failure | stats count").rows[0][0]).toBe(TRUTH.failureCount);
    expect(q("action=failure NOT user=root | stats count").rows[0][0]).toBeLessThan(TRUTH.failureCount);
    expect(q("source=dns query=*cdn.net* | stats count").rows[0][0]).toBe(30);
    expect(Number(q("user=admin OR user=root | stats count").rows[0][0])).toBeGreaterThan(0);
  });
  it("aggregates, sorts and limits", () => {
    const t = q("source=auth action=failure | stats count by src_ip | sort -count | head 1");
    expect(t.rows[0][0]).toBe(TRUTH.topFailureIp);
    expect(t.rows[0][1]).toBe(TRUTH.topFailureIpCount);
    expect(q("source=auth action=failure | top 1 src_ip").rows[0][0]).toBe(TRUTH.topFailureIp);
    expect(q("source=firewall | stats sum(bytes_out) as total by host | sort -total | head 1").rows[0][0]).toBe(TRUTH.exfilHost);
    expect(q("source=dns query=update-check.example-cdn.net | stats count by host").rows[0]).toEqual([TRUTH.beaconHost, TRUTH.beaconCount]);
  });
  it("finds the compromised account and uses where", () => {
    expect(String(q(`src_ip=${TRUTH.topFailureIp} action=success | table user`).rows[0][0])).toBe(TRUTH.compromisedUser);
    const w = q("source=auth action=failure | stats count by src_ip | where count > 10");
    expect(w.rows.length).toBeGreaterThan(0);
    expect(w.rows.every((r) => Number(r[1]) > 10)).toBe(true);
    expect(q("source=dns | stats dc(query) as domains by host").columns).toEqual(["host", "domains"]);
  });
  it("gives helpful errors", () => {
    expect(() => q("action=failure | frobnicate")).toThrow(QueryError);
    expect(() => q("action=failure | sort nothere")).toThrow(/Unknown field/);
    expect(() => q("action=failure | stats")).toThrow(QueryError);
  });
});
