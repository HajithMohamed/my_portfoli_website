import Script from "next/script";

export function ThemeScript() {
  const code = `(function() {
    try {
      var stored = localStorage.getItem('hz_theme');
      var theme = (stored === 'ember' || stored === 'jarvis') ? stored : 'jarvis';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'jarvis');
    }
  })();`;

  return (
    <Script id="hz-theme-script" strategy="beforeInteractive">
      {code}
    </Script>
  );
}

