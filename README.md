# seo-schema-org

## About

Put schema.org on Web pages and business/location pages based on local variables from `config.toml`.

This library keeps a generic mapping layer between:
- the schema.org fields expected by the partials;
- the real variable names used by each Hugo site.

## Changelog

### v3.0.0 - 10 septembre 2026

- Generate one JSON-LD script and one `@graph` per page
- Link `WebSite`, `WebPage`, business entities, optional `Person`, and optional `BreadcrumbList` with stable `@id` values
- Accept `typeseo` as either a string or an array
- Use the page publication and modification dates instead of build time
- Support multiple phone numbers, separate weekday/weekend opening hours, and optional `priceRange`
- Treat unmapped optional fields as absent instead of failing the Hugo build
- Resolve mappings from Hugo parameters or language data files with `data.*`; arrays of mappings are combined into a list
- Build `priceRange` from separate amount/symbol fields and `Person.name` from given/family names when needed
- Breaking change for custom `seo_metadata_js_<type>.html` partials: they must return an entity `dict`; the entry point owns JSON serialization

### v2.1 - 26 juillet 2026

- Add support for `Restaurant`
- Add support for `VacationRental`
- Add support for `EventVenue`
- Document new `params.seo_json` mappings for restaurant, chalet rental and private events pages

### v2.0 - 26 juillet 2026

- **Performance**: invariant SEO variables (social, logo, geo, address, phone, opening hours, priceRange) are cached with `partialCached`, split by language for multilingual sites
- **Robustness**: JSON-LD is generated with `jsonify` from Go template `dict` objects instead of manual string concatenation
- **Simplification**: common variable initialization shared by `LocalBusiness`, `LodgingBusiness`, etc. is now factorized in `seo_common_vars.html`
- **Build safety**: a missing `typeseo` partial no longer breaks the Hugo build; a clear warning is emitted instead with `templates.Exists`
- The main image fingerprint is no longer computed twice for `image` and `photo`

### v1.2 - 22 juillet 2020

- Tout en Asset

### v1.1 - 12 juillet 2020

- Ajoute js_campground SPECIFIQUE

## Usage

1 - Define the mapping for the relevant `params.seo_json` fields.
2 - Add `typeseo = "localbusiness"` or `typeseo = ["localbusiness", "restaurant"]` in Params and/or front matter.
3 - The library loads each matching `seo_metadata_js_<type>.html` partial and includes its entity in the page graph.

Example:

```toml
[params.seo_json]
  officeAddress       = "addresse.addresse"
  officeAddressVille  = "addresse.ville"
  officeAddressRegion = "addresse.region"
  officeAddressCP     = "addresse.cp"
  officeAddressPays   = "addresse.pays"

[params.seo_schema]
  breadcrumb = true

[params.addresse]
  addresse = "202, avenue de Colmar (Neudorf-Meinau)"
  cp = "67100"
  ville = "Strasbourg"
  pays = "France"
  region = "Alsace"
```

### `config.toml`

File: `config.toml`

```toml
[params.seo_json]
  # basic used by website
  social_facebook   = "my real variable name"
  social_twitter    = "my real variable name"
  social_instagram  = "my real variable name"
  image             = "my real variable name"
  defaultKeywords   = "my real variable name"

  # used by localbusiness / lodgingbusiness / restaurant / vacationrental / eventvenue
  logo              = "my real variable name"
  geo_type          = "my real variable name"
  geo_latitude      = "my real variable name"
  geo_longitude     = "my real variable name"

  officeAddress       = "my real variable name"
  officeAddressName   = "my real variable name"
  officeAddressVille  = "my real variable name"
  officeAddressRegion = "my real variable name"
  officeAddressCP     = "my real variable name"
  officeAddressPays   = "my real variable name"

  # officePhones takes precedence; officePhone remains supported.
  officePhone = "my real variable name"
  officePhones = "my real variable name"

  # should be a dictionary / array like:
  # ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
  officeHorairesJours = "my real variable name"
  officeHorairesOpen  = "my real variable name"
  officeHorairesClose = "my real variable name"
  officeHorairesJoursWE = "my real variable name"
  officeHorairesOpenWE  = "my real variable name"
  officeHorairesCloseWE = "my real variable name"

  priceRange = "my real variable name"
  # alternative for a centralized amount and display symbol
  priceAmount         = "data.contact.tarifMontant"
  priceCurrencySymbol = "data.contact.tarifSymbole"

  # optional Person entity
  personName     = "my real variable name"
  personGivenName  = "data.contact.first_name"
  personFamilyName = "data.contact.last_name"
  personJobTitle = "my real variable name"
  personImage    = "my real variable name"

  # used by lodgingbusiness
  checkinTime   = "my real variable name"
  checkoutTime  = "my real variable name"
  numberOfRooms = "my real variable name"
  petsAllowed   = "my real variable name"

  # used by restaurant
  servesCuisine       = "TODO"
  acceptsReservations = "TODO"
  hasMenu             = "TODO"

  # used by vacationrental
  numberOfBedrooms = "TODO"
  occupancy        = "TODO"
  amenityFeature   = "TODO"
  # numberOfRooms and petsAllowed can be reused from lodgingbusiness

  # used by eventvenue
  maximumAttendeeCapacity = "TODO"
  smokingAllowed          = "TODO"
  # amenityFeature can be reused here too
```

### HTML template usage

Inside your `<head>` section:

```go-html-template
{{ partial "seo_metadata.html" . }}
```

### Frontmatter examples

#### Restaurant page

```toml
typeseo = ["restaurant"]
```

#### Chalet or room rental page

```toml
typeseo = ["vacationrental"]
```

#### Private events / weddings / seminars page

```toml
typeseo = ["eventvenue"]
```

#### Multiple types on the same page

```toml
typeseo = ["localbusiness", "restaurant"]
```

## Supported types

| `typeseo` value | schema.org type | Typical usage |
|---|---|---|
| `localbusiness` | `LocalBusiness` | Main business page |
| `lodgingbusiness` | `LodgingBusiness` | Hotel / guest house / lodging page |
| `restaurant` | `Restaurant` | Restaurant or food service page |
| `vacationrental` | `VacationRental` | Chalet, lodge, rental unit, room rental page |
| `eventvenue` | `EventVenue` | Weddings, seminars, private events, receptions |
| `web` | `WebPage` | Base schema generated on all pages |

`WebSite` and `WebPage` are always generated. The `web` value is accepted for
backward compatibility but is not required. Set
`params.seo_schema.breadcrumb = true` to add a `BreadcrumbList` to non-home
pages. A `Person` is added when `personName` resolves to a non-empty value.
Set `params.seo_schema.inherit_site_types = true` when site-level `typeseo`
must also apply to every page that does not define its own value.

## Architecture internals

| File | Role |
|---|---|
| `seo_metadata.html` | Entry point. Builds and serializes the single JSON-LD `@graph` |
| `seo_common_vars.html` | Combines shared SEO variables for a page |
| `seo_common_vars_site.html` | Resolves and caches invariant site-level SEO variables, with multilingual cache isolation |
| `seo_find_param.html` | Maps generic library field names to the actual site variable names defined in `[params.seo_json]` |
| `seo_metadata_js_website.html` / `seo_metadata_js_web.html` | Base `WebSite` and `WebPage` entities |
| `seo_metadata_js_person.html` / `seo_metadata_js_breadcrumb.html` | Optional `Person` and `BreadcrumbList` entities |
| `seo_metadata_js_localbusiness.html` | `LocalBusiness` schema |
| `seo_metadata_js_lodgingbusiness.html` | `LodgingBusiness` schema |
| `seo_metadata_js_restaurant.html` | `Restaurant` schema |
| `seo_metadata_js_vacationrental.html` | `VacationRental` schema |
| `seo_metadata_js_eventvenue.html` | `EventVenue` schema |
| `seo_metadata_title.html` / `seo_metadata_description.html` | Resolve SEO title and description with fallback logic |

## Add a new schema.org type

1. Create `layouts/partials/seo_metadata_js_<type>.html`
2. Reuse common variables:
   ```go-html-template
   {{- $seo := partial "seo_common_vars.html" . -}}
   ```
3. Add type-specific variables:
   ```go-html-template
   {{- $seo_myVar := partial "seo_find_param.html" (dict "context" . "var" "myVar") -}}
   ```
4. Add the mapping in `[params.seo_json]`
5. Return the entity `dict`:
   ```go-html-template
   {{ return $entity }}
   ```

Do not serialize the custom entity. `seo_metadata.html` serializes the complete
graph once.

### Mapping values from data files

A mapping normally resolves a Hugo parameter, preserving the historical API:

```toml
officeAddress = "global.seo.addresse.addresse"
```

Prefix the path with `data.` to resolve it below the current language in
`data/<language>/`. A mapping can also be an array when the schema property
expects multiple values:

```toml
officePhones = ["data.contact.phone1", "data.contact.phone2"]
```

Missing data paths are omitted without failing the build.

If `typeseo = ["mytype"]` is declared but `seo_metadata_js_mytype.html` does not exist, the build will emit a warning instead of crashing.

## Multilingual notes

`seo_common_vars_site.html` uses `partialCached` with language isolation. This means multilingual sites can define different address, phone or opening hours values per language without cache collisions.

## Notes for the new types

### Restaurant

Recommended use:
- restaurant overview page
- menu page
- dining page for a hotel, chalet or lodge website

Specific fields:
- `servesCuisine`
- `acceptsReservations`
- `hasMenu`

### VacationRental

Recommended use:
- one page per chalet
- one page per rental unit
- one detailed room or suite page when treated like a rental unit

Specific fields:
- `numberOfRooms`
- `numberOfBedrooms`
- `occupancy`
- `amenityFeature`
- `petsAllowed`

### EventVenue

Recommended use:
- weddings page
- seminars page
- private hire / receptions page
- corporate events page

Specific fields:
- `maximumAttendeeCapacity`
- `amenityFeature`
- `smokingAllowed`

`Event` markup is intentionally not included here. It should be added later on dedicated agenda or event detail pages.

## Credits

- Copyright © 2020-2026, Didier Georgieff divinerites@gmail.com
