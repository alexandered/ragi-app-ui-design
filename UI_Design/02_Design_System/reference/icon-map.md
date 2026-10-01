# icon-map.md

Load when choosing or placing an icon in stage 2 or 3: PRD concept to Lucide icon name, each verified to exist.

> Pack: Lucide (proposed, see `_foundation/iconography.md`). Names checked 2026-09-29 against `lucide-react-native` 1.48.0 and `lucide_icons_flutter` 3.1.20 (Lucide 1.46.0). [VALID UNTIL 2026-12]
> Flutter writes the same names in camelCase (`LucideIcons.arrowLeft`). The prototype uses the SVG of the same name. `history` and `trash-2` are aliases in the RN package and still work.

## Auth and profile
| Concept | Lucide name |
|---|---|
| email field | `mail` |
| password | `lock` |
| show / hide password | `eye` / `eye-off` |
| log out | `log-out` |
| profile | `user` |
| phone | `phone` |
| change password | `key-round` |

## Navigation and general actions
| Concept | Lucide name |
|---|---|
| home / dashboard | `house` |
| my recipes | `book-open` |
| search | `search` |
| filter | `list-filter` |
| add | `plus` |
| back | `arrow-left` |
| chevron right / down | `chevron-right` / `chevron-down` |
| more menu | `ellipsis-vertical` |
| close | `x` |
| confirm | `check` |
| settings | `settings` |
| advanced options | `sliders-horizontal` |

## Recipes and trials
| Concept | Lucide name | PRD |
|---|---|---|
| edit | `pencil` | REC-03, TRL-02 |
| delete | `trash-2` | REC-04, TRL-03, ING-01 |
| copy trial | `copy` | CPY-01 |
| reorder handle | `grip-vertical` | ING-01 |
| undo | `undo-2` | ING-01 snackbar |
| date | `calendar` | TRL-01 |
| journal / notes | `notebook-pen` | TRL-01 |
| trial (experiment) | `flask-conical` | trials |
| trial history | `history` | HIS-01 |
| compare | `git-compare` | CMP-01 [CR-02] |
| swap columns ("Tukar") | `arrow-left-right` | CMP-01 [CR-02] |
| scale recipe ("Skalakan") | `scaling` | SCL-01, SCL-02 |
| grams / weighing | `scale` | BR-06 |
| baker's % | `percent` | MET-01 [CR-01] |
| dough metrics | `calculator` | MET-01 [CR-01] |
| Stable Trial | `star` | STB-01 |
| Stable badge (alternative) | `badge-check` | STB-01 |
| verdict Berhasil | `circle-check` | TRL-04 |
| verdict Gagal | `circle-x` | TRL-04 |
| verdict Belum dinilai | `hourglass` | TRL-04 |
| PDF report | `file-text` | PDF-01 |
| share | `share-2` | PDF-01 |
| download | `download` | PDF-01 |
| students | `users` | CHF-01 |
| student search | `user-search` | CHF-01 |
| Chef | `chef-hat` | role |

## Global states
| Concept | Lucide name |
|---|---|
| info | `info` |
| warning | `triangle-alert` |
| error | `circle-alert` |
| offline | `wifi-off` |
| retry | `refresh-cw` |
| empty state | `inbox` |

## Baking glyphs available in Lucide
| Concept | Lucide name |
|---|---|
| flour (Tepung) | `wheat` |
| liquid (Cairan) | `droplet` |
| egg (Telur) | `egg` |
| milk | `milk` |
| pastry | `croissant` |
| cake | `cake` |
| cookies | `cookie` |
| cupcake | `cupcake` (not in the Flutter package yet) |
| dessert | `dessert` |
| portions | `utensils` |
| timer | `timer` |
| thermometer | `thermometer` |

## Not in Lucide
Plain bread (Roti), salt (Garam), sugar (Gula), yeast (Ragi), butter or fat (Lemak), oven, whisk, rolling pin, mixing bowl. Default to text chips for ingredient types; gap-fill options are in `_foundation/iconography.md`.
