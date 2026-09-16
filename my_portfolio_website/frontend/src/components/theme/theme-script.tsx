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

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
