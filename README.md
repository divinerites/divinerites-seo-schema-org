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

  # Used by lodgingbusiness (en plus des champs ci-dessus)
  checkinTime   = "my real variable name"
  checkoutTime  = "my real variable name"
  numberOfRooms = "my real variable name"
  petsAllowed   = "my real variable name"
```

### HTML template Usage

Inside your `<head>` section

```go-html-template
{{ partial "seo_metadata.html" . }}
```

## Architecture interne (depuis v2.0)

| Fichier | Rôle |
|---|---|
| `seo_metadata.html` | Point d'entrée. Génère le bloc `WebPage` commun à toutes les pages, puis boucle sur `typeseo` (frontmatter ou `site.Params`) pour appeler le partial du type correspondant. |
| `seo_common_vars.html` | Assemble les variables SEO pour un type donné : combine les valeurs mises en cache (site) et les valeurs dépendantes de la page (`image`). |
| `seo_common_vars_site.html` | Résout et met en cache (`partialCached`, par langue) les variables invariantes au niveau du site : social, logo, geo, adresse, téléphone, horaires, priceRange. |
| `seo_find_param.html` | Indirection entre les noms de variables imposés par la lib (ex. `officeAddress`) et les vraies variables du site définies dans `[params.seo_json]`. |
| `seo_metadata_js_web.html` | Génère le bloc `WebPage` de base, commun à toutes les pages. |
| `seo_metadata_js_<type>.html` | Un partial par type schema.org (`localbusiness`, `lodgingbusiness`, etc.), construit un `dict` puis appelle `jsonify`. |
| `seo_metadata_title.html` / `seo_metadata_description.html` | Résolvent le titre et la description SEO avec fallback sur les params du site. |

### Ajouter un nouveau type schema.org

1. Créer `layouts/partials/seo_metadata_js_<type>.html`.
2. Récupérer les variables communes :
`{{- $seo := partial "seo_common_vars.html" . -}}`.
3. Ajouter les variables spécifiques au type via `seo_find_param.html`, par exemple :
```go-html-template
{{- $seo_maVariable := partial "seo_find_param.html" (dict "context" . "var" "maVariable") -}}
   ```
4. Documenter la nouvelle variable dans `[params.seo_json]` du `config.toml` (section ci-dessus).
5. Construire le `dict` final (`$mainEntity`, `$root`) et terminer par `{{ jsonify $root }}`.
6. Déclarer le type dans le frontmatter ou `site.Params` : `typeseo = ["<type>"]`.

Aucun fichier existant n'a besoin d'être modifié : `seo_metadata.html` détecte automatiquement le nouveau partial via `templates.Exists` et affiche un avertissement de build clair si le fichier est absent ou mal nommé.

### Notes sur le multilingue

`seo_common_vars_site.html` est mis en cache par langue (`.Language`). Si votre site multilingue définit des adresses, téléphones ou horaires différents par langue (fichiers `config/<lang>/config.toml`), chaque langue conserve sa propre valeur en cache sans conflit.

### Credits

- Copyright © 2020-2026, Didier Divinerites divinerites@gmail.com
