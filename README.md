# seo-schema-org

## About

Put schema.org on Web pages and LocalBusiness based on local variables from config.toml

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
