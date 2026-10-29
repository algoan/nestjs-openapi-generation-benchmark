# nestjs-zod: differences with the expected document

## requestBody (51)

Most frequent:

- ×3 `extra body $.birthDate#nullable`
- ×3 `extra body $.vaccinations#nullable`
- ×3 `extra body $.vaccinations[].expiresAt#nullable`
- ×3 `extra body $.weightKg#nullable`
- ×2 `mismatch body $.available#type`
- ×2 `extra body $.address#nullable`
- ×2 `extra body $.address.complement#nullable`
- ×2 `extra body $.email#nullable`
- ×2 `extra body $.tags#nullable`
- ×2 `extra body $.metadata#nullable`
- ×2 `extra body $.name#nullable`
- ×2 `extra body $.status#nullable`
- ×2 `extra body $.coatPattern#nullable`
- ×2 `extra body $.authors[].birthYear#nullable`
- ×2 `extra body $.publishedOn#nullable`

<details><summary>All</summary>

- **mismatch** `POST /v1/shelters/{shelterId}/dogs body application/json $.goodWithKids#type` — expected `boolean`, got `array`
- **mismatch** `POST /v1/books body application/json $.available#type` — expected `boolean`, got `array`
- **mismatch** `PUT /v1/books/{isbn} body application/json $.available#type` — expected `boolean`, got `array`
- **extra** `POST /v1/shelters body application/json $.address#nullable` — got `true`
- **extra** `POST /v1/shelters body application/json $.address.complement#nullable` — got `true`
- **extra** `POST /v1/shelters body application/json $.email#nullable` — got `true`
- **extra** `POST /v1/shelters body application/json $.tags#nullable` — got `true`
- **extra** `POST /v1/shelters body application/json $.metadata#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{id} body application/json $.name#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{id} body application/json $.address#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{id} body application/json $.address.complement#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{id} body application/json $.email#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{id} body application/json $.capacity#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{id} body application/json $.tags#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{id} body application/json $.metadata#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{id} body application/json $.status#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/cats body application/json $.birthDate#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/cats body application/json $.vaccinations#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/cats body application/json $.vaccinations[].expiresAt#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/cats body application/json $.weightKg#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/cats body application/json $.coatPattern#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.name#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.birthDate#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.sex#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].expiresAt#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.weightKg#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.indoor#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.coatPattern#nullable` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.status#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/dogs body application/json $.birthDate#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/dogs body application/json $.vaccinations#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/dogs body application/json $.vaccinations[].expiresAt#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/dogs body application/json $.weightKg#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/dogs body application/json $.goodWithKids[]#type` — got `boolean`
- **extra** `POST /v1/shelters/{shelterId}/adoptions body application/json $.adopter.phone#nullable` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions body application/json $.notes#nullable` — got `true`
- **extra** `POST /v1/books body application/json $.authors[].birthYear#nullable` — got `true`
- **extra** `POST /v1/books body application/json $.publishedOn#nullable` — got `true`
- **extra** `POST /v1/books body application/json $.pageCount#nullable` — got `true`
- **extra** `POST /v1/books body application/json $.language#nullable` — got `true`
- **extra** `POST /v1/books body application/json $.topics#nullable` — got `true`
- **extra** `POST /v1/books body application/json $.rating#nullable` — got `true`
- **extra** `POST /v1/books body application/json $.available[]#type` — got `boolean`
- **extra** `PUT /v1/books/{isbn} body application/json $.authors[].birthYear#nullable` — got `true`
- **extra** `PUT /v1/books/{isbn} body application/json $.publishedOn#nullable` — got `true`
- **extra** `PUT /v1/books/{isbn} body application/json $.pageCount#nullable` — got `true`
- **extra** `PUT /v1/books/{isbn} body application/json $.language#nullable` — got `true`
- **extra** `PUT /v1/books/{isbn} body application/json $.topics#nullable` — got `true`
- **extra** `PUT /v1/books/{isbn} body application/json $.rating#nullable` — got `true`
- **extra** `PUT /v1/books/{isbn} body application/json $.available[]#type` — got `boolean`

</details>

## constraints (8)

Most frequent:

- ×3 `missing success $.authors[].birthYear#integer`
- ×2 `extra body $.pageCount#maximum`
- ×1 `missing param query:year $#integer`
- ×1 `missing success $.resources[].authors[].birthYear#integer`
- ×1 `extra param query:minAge $#maximum`

<details><summary>All</summary>

- **missing** `GET /v1/shelters/{id}/stats param query:year $#integer` — expected `true`
- **missing** `GET /v1/books success application/json $.resources[].authors[].birthYear#integer` — expected `true`
- **missing** `POST /v1/books success application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `GET /v1/books/{isbn} success application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `PUT /v1/books/{isbn} success application/json $.authors[].birthYear#integer` — expected `true`
- **extra** `GET /v1/shelters/{shelterId}/animals param query:minAge $#maximum` — got `9007199254740991`
- **extra** `POST /v1/books body application/json $.pageCount#maximum` — got `9007199254740991`
- **extra** `PUT /v1/books/{isbn} body application/json $.pageCount#maximum` — got `9007199254740991`

</details>

## docs (8)

Most frequent:

- ×4 `missing param path:id#description`
- ×3 `missing param path:isbn#description`
- ×1 `missing param query:year#description`

<details><summary>All</summary>

- **missing** `GET /v1/shelters/{id} param path:id#description` — expected `The shelter id`
- **missing** `DELETE /v1/shelters/{id} param path:id#description` — expected `The shelter id`
- **missing** `PATCH /v1/shelters/{id} param path:id#description` — expected `The shelter id`
- **missing** `GET /v1/shelters/{id}/stats param path:id#description` — expected `The shelter id`
- **missing** `GET /v1/shelters/{id}/stats param query:year#description` — expected `The year of the statistics`
- **missing** `GET /v1/books/{isbn} param path:isbn#description` — expected `ISBN-13, without dashes`
- **missing** `PUT /v1/books/{isbn} param path:isbn#description` — expected `ISBN-13, without dashes`
- **missing** `DELETE /v1/books/{isbn} param path:isbn#description` — expected `ISBN-13, without dashes`

</details>

