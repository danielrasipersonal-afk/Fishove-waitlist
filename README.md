# Fishove — muokkausohje

## GitHub Pages ja linkkiesikatselu

1. Lisää projektin tiedostot GitHub-repositorioon, myös `.github/workflows/pages.yml` ja `scripts/build-pages.py`.
2. Valitse repositorion **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Puske `main`- tai `master`-haaraan. **Actions → Deploy GitHub Pages** julkaisee sivun; työnkulun voi myös käynnistää käsin.
4. Kopioi valmis julkinen osoite **Settings → Pages** -näkymästä.

Oma domain asetetaan GitHubin **Settings → Pages → Custom domain** -kohdassa ja domainin DNS-asetuksissa. Kun domain on käytössä, käynnistä julkaisu uudelleen, jotta myös `og:url`, canonical ja kuvien osoitteet päivittyvät. Domainia ei ole vielä määritelty tässä projektissa.

`assets/social/fishove-preview.png` on liitetty 1200 × 630 px:n kuva sellaisenaan. `assets/social/fishove-icon.png` on alkuperäinen logokuva. Siitä on tehty selaimen favicon `assets/social/favicon-96.png` (96 × 96 px) ja iPhonen/iPadin kotinäyttökuvake `assets/social/apple-touch-icon.png` (180 × 180 px). Otsikko, erillinen hakukonekuvaus, linkin kuvaus, sivuston nimi, kuvan mitat ja vaihtoehtoinen teksti sekä Twitter-kortin tiedot ovat `index.html`-tiedoston alussa.

Julkaisu korvaa HTML:n `{{SITE_URL}}`-merkinnät GitHub Pagesin todellisella osoitteella ennen tiedostojen lataamista palveluun. Käytä yllä kuvattua GitHub Actions -julkaisua: suora **Deploy from a branch** ei korvaa merkintöjä. Paikallisen julkaisuversion voi tehdä komennolla `SITE_URL=https://example.com/fishove python3 scripts/build-pages.py`; tulos löytyy `_site/`-hakemistosta.

Linkkipalvelut voivat säilyttää vanhan esikatselun välimuistissa, eikä jokainen palvelu näytä kaikkia metatietoja.

Avaa `index.html` selaimessa. Projekti ei tarvitse asennusta tai build-komentoa. Päivitä selain muutosten jälkeen. Vanha `index-2.html` ohjaa automaattisesti varsinaiselle aloitussivulle.

## Tiedostot

- `index.html`: sivun rakenne, navigaatio, etusivun tekstit ja lomake. Näkymät on merkitty kommenteilla.
- `css/styles.css`: värit, fontit, asettelu ja responsiivisuus. Yhteiset muuttujat ovat alun `:root`-lohkossa, mobiilityylit lopun `@media`-lohkoissa.
- `css/motion.css`: hoverit, painallukset ja siirtymien yhteiset kestot.
- `assets/fonts/`: sivun paikalliset Kalnia- ja Inter-fontit sekä niiden OFL-lisenssit. Sivu ei lataa fontteja ulkopuolisesta palvelusta.
- `js/quiz-data.js`: testin kysymykset, vastausvaihtoehdot ja tulosprofiilit.
- `js/config.js`: odotuslistan palveluosoite (`waitlistEndpoint`). Tyhjänä lomake näyttää esikatseluviestin eikä lähetä sähköpostia.
- `js/app.js`: näkymien vaihto, pisteytys, näppäinoikotiet ja lomakkeen lähetys.
- `js/motion.js`: näkymien ilmestymiset, korttien porrastukset ja valinnan palaute. Vähennetyn liikkeen asetus poistaa liikeanimaatiot.

## Muokkaaminen

Muokkaa etusivun ja lomakkeen tekstejä HTML-tiedostossa, testin sisältöä tiedostossa `js/quiz-data.js` ja ulkoasua CSS-tiedostossa.

Vastausvaihtoehto sisältää otsikon, kuvauksen ja profiilin tunnuksen. Tunnuksen tulee vastata `profiles`-olion avainta. Kuvauksen `<em>`-merkinnät korostetaan pinkillä. Säilytä neljä vastausvaihtoehtoa kysymystä kohden, jotta A–D-näppäinoikotiet vastaavat kortteja. Tasapisteissä viimeisin vastaus ratkaisee.

Säilytä HTML:n `id`- ja `data-action`-arvot, koska JavaScript käyttää niitä. Säilytä skriptien järjestys: kysymykset, asetukset, animaatiot, sovellus. `defer` suorittaa skriptit HTML:n latauduttua. HTML pidetään yhdessä tiedostossa, jotta sivu toimii myös suoraan selaimessa ilman palvelinta.

Responsiiviset rajat löytyvät CSS-tiedoston lopusta. Vähintään 1440 px leveä näkymä käyttää neljää korttia, tabletti kahta ja enintään 700 px leveä puhelinnäkymä yhtä korttia rivillä. Kysymysten `<br>`-merkinnät säilyttävät suunnittelun rivijaon vähintään 1680 px leveydessä; pienemmissä näkymissä teksti rivittyy vapaasti. Tulosten ja lomakkeen rivijako vapautuu puhelimella. Kalnian otsikoiden paino on 500, ja leipäteksti käyttää Interiä.

## Tarkistus muutosten jälkeen

Avaa etusivu, käy testi läpi, kokeile A–D-näppäimiä ja avaa odotuslista. Tarkista myös kapea selainikkuna. Kun palveluosoite on tyhjä, lomakkeen tulee kertoa, ettei osoitetta ole lähetetty.
