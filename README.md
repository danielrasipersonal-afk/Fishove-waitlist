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

- `index.html`: sivun rakenne, etusivu, valikko, manifesti, testi ja odotuslistan lomakkeet.
- `css/styles.css`: värit, fontit, asettelu ja responsiivisuus. Yhteiset muuttujat ovat alun `:root`-lohkossa, mobiilityylit lopun `@media`-lohkoissa.
- `css/motion.css`: hoverit, painallukset ja siirtymien yhteiset kestot.
- `assets/fonts/`: sivun paikalliset Kalnia- ja Inter-fontit sekä niiden OFL-lisenssit. Sivu ei lataa fontteja ulkopuolisesta palvelusta.
- `js/quiz-data.js`: testin kysymykset, vastausvaihtoehdot ja tulosprofiilit.
- `js/manifest-data.js`: manifestin kuusi lukua. Sisältö muodostetaan turvallisesti tekstielementeiksi.
- `js/config.js`: odotuslistan palveluosoite (`waitlistEndpoint`). Tyhjänä lomake näyttää esikatseluviestin eikä lähetä sähköpostia.
- `js/app.js`: näkymien vaihto, pisteytys, näppäinoikotiet ja lomakkeen lähetys.
- `js/motion.js`: näkymien ilmestymiset, korttien porrastukset ja valinnan palaute. Vähennetyn liikkeen asetus poistaa liikeanimaatiot.

## Muokkaaminen

Muokkaa etusivun ja lomakkeen tekstejä HTML-tiedostossa, testin sisältöä tiedostossa `js/quiz-data.js` ja ulkoasua CSS-tiedostossa.

Vastausvaihtoehto sisältää otsikon, kuvauksen ja profiilin tunnuksen. Tunnuksen tulee vastata `profiles`-olion avainta. Kuvauksen `<em>`-merkinnät korostetaan pinkillä. Säilytä neljä vastausvaihtoehtoa kysymystä kohden, jotta A–D-näppäinoikotiet vastaavat kortteja. Tasapisteissä viimeisin vastaus ratkaisee.

Säilytä HTML:n `id`- ja `data-action`-arvot, koska JavaScript käyttää niitä. Säilytä skriptien järjestys: kysymykset, asetukset, animaatiot, manifestin sisältö, sovellus. `defer` suorittaa skriptit HTML:n latauduttua. HTML pidetään yhdessä tiedostossa, jotta sivu toimii myös suoraan selaimessa ilman palvelinta.

Responsiiviset rajat löytyvät CSS-tiedoston lopusta. Vähintään 1440 px leveä näkymä käyttää neljää korttia, tabletti kahta ja enintään 700 px leveä puhelinnäkymä yhtä korttia rivillä. Sisältöalueen enimmäisleveys on 1728 px, ja sivureunusten sekä korttivälien kasvu on rajattu myös ultraleveillä näytöillä. Otsikot käyttävät paikallista Kalniaa, ja leipäteksti paikallista Interiä.

Korttien kuvausteksti on vähintään 18 px, tuloksen leipäteksti vähintään 22 px ja puhelimen kyselyohje 16 px. Korttien rivit tasapainotetaan fonttien latauduttua ja koon muuttuessa: toisella rivillä on vähintään kolme sanaa. Myös muille riveille pyritään saamaan vähintään kolme sanaa, mutta tarvittaessa ensimmäisellä tai viimeisillä riveillä sallitaan kaksi. Tekstin kokoa ei pienennetä rivijaon saavuttamiseksi. Pinkit painotukset ja välimerkit säilyvät.

Figma-tyyppinen kirjainväli määritellään suhteessa fonttikokoon: `--tracking-body: -.03em` vastaa −3 %:a, `--tracking-display: -.05em` vastaa −5 %:a ja sähköpostin paikkamerkin `--tracking-tight: -.08em` vastaa −8 %:a. Yksittäisillä navigaatio- ja aputeksteillä on omat hienosäätönsä.

Väripaletti on `#FAFAFA`, `#0A0A0A`, `#F8036C` ja `#56001F`. Hillityt tekstit ja reunukset muodostetaan näiden värien sekoituksista. “What If Love Had a Brand” on noin kolmen sekunnin tekstianimaatio: sanat ilmestyvät porrastetusti kevyellä pystysuuntaisella liikkeellä ja häivytyksellä. Tämän jälkeen sivu jää pinkkiin sähköposti- ja testinäkymään. Vähennetyn liikkeen asetuksella aloitusanimaatio ohitetaan. Navigointi keskeyttää aloitusanimaation; logo ja takaisin-navigointi eivät toista sitä.

Pinkin näkymän sähköpostitekstin koko (`--entry-size`, 26–48 px) ohjaa myös testipainikkeen tekstikokoa, leveyttä ja korkeutta. Näin kenttä ja painike säilyttävät keskinäiset mittasuhteensa puhelimella, tabletilla ja desktopilla. Alareunan navigaatiopainikkeiden kirjainväli on −5 %. Testin tuloksessa ja odotuslistan lomakkeessa yläreunan navigaatio näyttää WAITLIST-painikkeen ilman logoa.

Yläreunan WAITLIST ja alareunan waitinglist avaavat odotuslistan lomakkeen. Sen lähetyspainike näkyy myös ennen kirjoittamista; selain tarkistaa sähköpostiosoitteen lähetettäessä. Muut alareunan linkit vievät testiin ja manifestiin. Takaisin-painike palauttaa testin edelliseen kysymykseen tai näkymään, josta lomake/manifesti avattiin. Puhelimen näppäimistö avautuu vasta kenttää painettaessa.

`assets/icons/arrow-back.png` on toimitettu takaisin-nuoli. Manifestin numerot 01–04 käyttävät toimitettuja `assets/icons/chapter-01.png`–`chapter-04.png`-kuvia.

Molemmat sähköpostilomakkeet käyttävät samaa `waitlistEndpoint`-asetusta. Tyhjällä palveluosoitteella ne näyttävät esikatseluviestin.

## Tarkistus muutosten jälkeen

Avaa etusivu, käy testi läpi, kokeile A–D-näppäimiä ja avaa odotuslista. Tarkista myös kapea selainikkuna. Kun palveluosoite on tyhjä, lomakkeen tulee kertoa, ettei osoitetta ole lähetetty.
