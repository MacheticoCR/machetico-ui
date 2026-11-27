# Extraction inventory

The initial library adapts reusable presentation patterns from Machetico's Taurus frontend and the transport/ownership patterns reviewed in Folio. The maintainer subsequently authorized adoption in all four applications. Generic controls now delegate to the package; domain adapters retain their own contracts.

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

The generic UI now has one independent home. Applications import narrow UI entry points. Native field/table directives preserve existing business forms and cells; application adapters own translation, legal copy, currency, session and permissions.

## MacheTico landing frontend

Reviewed the root Angular frontend (excluding its nested reference checkouts). Its shell, video, metrics, home compositions, reveal, consent and native controls now consume shared implementations. Pre-existing unrelated changes are preserved. Application contracts remain local.

| Reference presentation                                                              | Library composition                                 | Application ownership retained                                               |
| ----------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------- |
| BackgroundVideo, Reveal                                                             | BackgroundVideo, Reveal directive                   | Exact public media URLs, Tailwind motion and responsive identity             |
| SiteHeader, SiteFooter, RouteStatus                                                 | SiteHeader, SiteFooter, RouteStatus                 | Router links, session/tenant configuration and navigation status             |
| HeroSection                                                                         | HeroSection, projected decorative media and actions | Brand copy and illustration                                                  |
| StatementSection, ExtrasTeaser                                                      | ContentSection                                      | Industry/module content and routes                                           |
| ClosingSection, ContractButton                                                      | ContentSection, Button                              | Contract navigation and command execution                                    |
| IndustryChapter                                                                     | FeatureChapter                                      | Industry contracts, images, links and feature copy                           |
| BundleValue                                                                         | ComparisonList, ContentSection                      | Prices, currency and commercial calculations                                 |
| MetricsList, InstallationMetrics                                                    | MetricsList                                         | API reads and response validation                                            |
| LegalDocument                                                                       | LegalDocument                                       | Published versions, document text and actual print/export command            |
| TermsConsent                                                                        | Consent                                             | Legal interpretation, accepted version persistence and payment authorization |
| PlanStep, PreviewStep, PaymentStep                                                  | Stepper, FieldGroup, SummaryCard, Consent           | Validation, checkout state and ONVO integration                              |
| ProvisioningChecklist                                                               | Checklist                                           | Server provisioning, credentials and operational completion                  |
| SoftwareCard, InstallationService                                                   | SummaryCard, MetricsList                            | Launch URLs, subscriptions and service commands                              |
| UserCreateForm, CompanyCreateForm, InstallationCreateForm                           | FieldGroup, Input, Checkbox, Select, FormActions    | Domain fields, validators and API commands                                   |
| UsersTable, CompanyUsers, CompanyModules, InstallationModules, InstallationSettings | Table, Checkbox, Select, Input, FieldGroup          | Roles, policies, module contracts and authorization                          |
| PanelShell                                                                          | Sidebar, SiteHeader, PageHeading                    | Lazy routes, guards and session ownership                                    |
| TestCredentials                                                                     | Not copied                                          | Development account credentials remain application-owned                     |

The demo provides local synthetic media (`demo/public/samples/background.webm`, reproducible with `node scripts/generate-demo-video.mjs`) and synthetic text. No customer records, secret configuration or backend code is extracted. The consumer installs the package; no private domain configuration is distributed.
