# Memory Game Prelander

Deze repository bevat een eenvoudige statische pagina waarmee bezoekers via een VIP-code kunnen deelnemen aan een spel. De pagina laadt een script dat een bezoek registreert en na het invoeren van een pincode een serverrequest doet voor verdere afhandeling.

## Gebruik

1. Clone de repository en open `index.html` in een moderne browser.
2. De pagina verwacht de URL-parameters `aff_id`, `offer_id` en `sub_id`. Ontbrekende waarden worden opgevuld met standaardwaarden.
3. Bel het aangegeven nummer, luister de code af en vul deze in op de pagina.
4. Bij een geldige code wordt automatisch doorgestuurd naar de URL die door de server wordt teruggegeven.

## Ontwikkeling

Er zijn geen externe afhankelijkheden nodig. Voor lokale wijzigingen kun je de pagina direct openen of een eenvoudige webserver gebruiken.

```bash
# voorbeeld met Python
python3 -m http.server
```

Bezoek dan `http://localhost:8000` in je browser.
