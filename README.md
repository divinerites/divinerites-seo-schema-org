# seo-schema-org

## About

Put schema.org on Web pages and LocalBusiness based on local variables from config.toml

## Changelog

### v2.0 - 26 juillet 2026

- **Performance** : les variables SEO invariantes (social, logo, geo, adresse, téléphone, horaires, priceRange) sont désormais mises en cache via `partialCached`, ventilé par langue pour les sites multilingues.
- **Robustesse** : le JSON-LD est généré via `jsonify` sur un `dict` Go-template plutôt que par concaténation manuelle de texte, ce qui évite un JSON invalide si une valeur contient un guillemet ou un caractère spécial.
- **Simplification** : le bloc d'initialisation des variables communes (partagé entre `LocalBusiness`, `LodgingBusiness`, etc.) est factorisé dans `seo_common_vars.html`, réduisant la duplication pour l'ajout de futurs types.
- **Fiabilité du build** : un `typeseo` sans partial correspondant ne fait plus planter le build ; un avertissement explicite est émis à la place (`templates.Exists`).
- Le calcul du fingerprint de l'image principale n'est plus dupliqué entre les champs `image` et `photo`.

### v1.2 - 22 juillet 2020

- Tout en Asset

### v1.1 - 12 juillet 2020

- Ajoute js_campground SPECIFIQUE

## Usage

1 - You have to give the correspondance for all those `params.seo_json` fields.
2 - If you want specifics seo on a page, add `typeseo = ["localbusiness", "campsite", "whatever type"]` to your Params and/or frontmatter.

For example

```toml
[params.seo_json]
  officeAddress       = "addresse.addresse"
  officeAddressVille  = "addresse.ville"
  officeAddressRegion = "addresse.region"
  officeAddressCP     = "addresse.cp"
  officeAddressPays   = "addresse.pays"

[params.addresse]
  addresse = "202, avenue de Colmar (Neudorf-Meinau)"
  cp = "67100"
  ville = "Strasbourg"
  pays = "France"
  region = "Alsace"
```

### config.toml

File : `config.toml`

```toml
[params.seo_json]
  # basic used by website
  social_facebook   = "my real variable name"
  social_twitter    = "my real variable name"
  social_instagram  = "my real variable name"
  image             = "my real variable name"
  defaultKeywords   = "my real variable name"

  # Used by localbusiness
  logo              = "my real variable name"
  geo_type          = "my real variable name"
  geo_latitude      = "my real variable name"
  geo_longitude     = "my real variable name"

  officeAddress       = "my real variable name"
  officeAddressVille  = "my real variable name"
  officeAddressRegion = "my real variable name"
  officeAddressCP     = "my real variable name"
  officeAddressPays   = "my real variable name"

  # propriété phone doit être unique pour schema.org
  officePhone = "my real variable name"

  officeHorairesJours = "my real variable name"
  officeHorairesOpen  = "my real variable name"
  officeHorairesClose = "my real variable name"
```

### HTML template Usage

Inside your `<head>` section

```go-html-template
	{{ partial "seo_metadata.html" . }}
```

### Credits

- Copyright © 2020 onwards, Didier Georgieff divinerites@gmail.com
