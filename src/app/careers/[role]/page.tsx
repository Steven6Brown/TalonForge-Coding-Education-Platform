import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CareerRole } from "@/components/sim/CareerRole";
import { ROLES, roleById } from "@/lib/sim/roles";

export const dynamicParams = false;
export function generateStaticParams() {
  return ROLES.filter((r) => !r.planned).map((r) => ({ role: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const role = roleById((await params).role);
  return role ? { title: `${role.title} Simulator`, description: role.blurb, alternates: { canonical: `/careers/${role.id}` } } : {};
}

export default async function RolePage({ params }: { params: Promise<{ role: string }> }) {
  const role = roleById((await params).role);
  if (!role || role.planned) notFound();
  return (
    <>
      <p className="muted small"><Link href="/careers">← Careers</Link></p>
      <h1>{role.title}</h1>
      <p className="muted lead">{role.blurb}</p>
      <CareerRole role={role} />
    </>
  );
}
