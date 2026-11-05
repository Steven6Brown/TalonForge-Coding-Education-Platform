import { brand } from "@/brands";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>
          © {new Date().getFullYear()} {brand.name}
          {brand.parent && (
            <>
              {" · A product of "}
              <a href={brand.parent.url} target="_blank" rel="noopener noreferrer">
                {brand.parent.name}
              </a>
              {brand.parent.motto ? <span className="muted"> · {brand.parent.motto}</span> : null}
            </>
          )}
        </p>
        {brand.poweredBy && <p className="muted small">Powered by TalonForge</p>}
        <p className="muted small">
          For education only. Practice security techniques solely on systems you own or have written permission to test.
        </p>
      </div>
    </footer>
  );
}
