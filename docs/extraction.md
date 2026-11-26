# Extraction inventory

The initial library adapts reusable presentation patterns from Machetico's Taurus frontend and the transport/ownership patterns reviewed in Folio. Reference repositories were read only. Megaphone and Folio consumers have not been migrated.

| Area                                           | Initial package                                   | Boundary                                                           |
| ---------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| Buttons, cards, text, badges, grids            | Headless native directives                        | Consumers own visual variants                                      |
| Select and choice list                         | Angular ARIA combobox/listbox                     | Consumer-owned choices and labels                                  |
| Pagination                                     | Angular ARIA toolbar                              | Consumer owns page reads                                           |
| Input, textarea, checkbox                      | Native forms and value accessors                  | Consumer owns form data/validation policy                          |
| Dialog/sidebar                                 | Native modal interaction and focus/scroll cleanup | Consumer owns open/close intent and styles                         |
| Range/image sliders                            | Native range; headless carousel                   | Consumer owns values, images and styles                            |
| Tables                                         | Semantic table, states and sort intent            | Consumer owns order, rows and backend pagination                   |
| Feedback, headings, skeletons, panels          | Headless presentation                             | Consumer supplies meaningful content and layout                    |
| Generic API                                    | Optional package entry point                      | No application endpoints, auth or permissions                      |
| Account/business/contact/opening-hours editors | Not extracted as generic business models          | Application/domain ownership must remain explicit                  |
| Catalog/product/sales widgets                  | Not extracted                                     | Depend on product, commerce and reporting contracts                |
| Image upload                                   | Not extracted                                     | Upload service/backend ownership needs a separate adapter contract |

The generic UI now has one independent home. Replacing duplicated implementations in existing consumers is subsequent work requiring their own migrations, regression gates and PRs. This inventory does not claim every application shared directory has already been migrated.
