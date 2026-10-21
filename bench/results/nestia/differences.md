# @nestia/sdk: differences with the expected document

## operations (1)

Most frequent:

- ×1 `missing `

<details><summary>All</summary>

- **missing** `GET /v1/books/export` — expected `true`

</details>

## parameters (1)

Most frequent:

- ×1 `mismatch param query:includeAdopted#required`

<details><summary>All</summary>

- **mismatch** `GET /v1/shelters/{shelterId}/animals param query:includeAdopted#required` — expected `false`, got `true`

</details>

## responses (8)

Most frequent:

- ×4 `extra success application/json`
- ×1 `missing success#status`
- ×1 `missing success`
- ×1 `missing success text/csv`
- ×1 `missing success $#type`

<details><summary>All</summary>

- **missing** `GET /v1/books/export success#status` — expected `200`
- **missing** `GET /v1/books/export success` — expected `true`
- **missing** `GET /v1/books/export success text/csv` — expected `true`
- **missing** `GET /v1/books/export success text/csv $#type` — expected `string`
- **extra** `DELETE /v1/shelters/{id} success application/json` — got `true`
- **extra** `DELETE /v1/shelters/{shelterId}/cats/{catId} success application/json` — got `true`
- **extra** `DELETE /v1/shelters/{shelterId}/adoptions/{adoptionId} success application/json` — got `true`
- **extra** `DELETE /v1/books/{isbn} success application/json` — got `true`

</details>

## constraints (80)

Most frequent:

- ×5 `missing body $.name#maxLength`
- ×3 `missing success $.address.street#maxLength`
- ×3 `missing body $.weightKg#minimum`
- ×3 `missing success $.adopter.firstName#maxLength`
- ×3 `missing success $.adopter.lastName#maxLength`
- ×3 `missing success $.adopter.email#format`
- ×3 `missing success $.authors[].birthYear#integer`
- ×3 `missing success $.authors[].birthYear#minimum`
- ×3 `missing success $.authors[].birthYear#maximum`
- ×2 `missing body $.address.street#maxLength`
- ×2 `missing body $.email#format`
- ×2 `missing body $.capacity#integer`
- ×2 `missing body $.capacity#minimum`
- ×2 `missing body $.capacity#maximum`
- ×2 `missing body $.tags#maxItems`

<details><summary>All</summary>

- **missing** `GET /v1/shelters success application/json $.resources[].address.street#maxLength` — expected `120`
- **missing** `POST /v1/shelters body application/json $.name#maxLength` — expected `100`
- **missing** `POST /v1/shelters body application/json $.address.street#maxLength` — expected `120`
- **missing** `POST /v1/shelters body application/json $.email#format` — expected `email`
- **missing** `POST /v1/shelters body application/json $.capacity#integer` — expected `true`
- **missing** `POST /v1/shelters body application/json $.capacity#minimum` — expected `0`
- **missing** `POST /v1/shelters body application/json $.capacity#maximum` — expected `1000`
- **missing** `POST /v1/shelters body application/json $.tags#maxItems` — expected `10`
- **missing** `POST /v1/shelters success application/json $.address.street#maxLength` — expected `120`
- **missing** `GET /v1/shelters/{id} success application/json $.address.street#maxLength` — expected `120`
- **missing** `PATCH /v1/shelters/{id} body application/json $.name#maxLength` — expected `100`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.street#maxLength` — expected `120`
- **missing** `PATCH /v1/shelters/{id} body application/json $.email#format` — expected `email`
- **missing** `PATCH /v1/shelters/{id} body application/json $.capacity#integer` — expected `true`
- **missing** `PATCH /v1/shelters/{id} body application/json $.capacity#minimum` — expected `0`
- **missing** `PATCH /v1/shelters/{id} body application/json $.capacity#maximum` — expected `1000`
- **missing** `PATCH /v1/shelters/{id} body application/json $.tags#maxItems` — expected `10`
- **missing** `PATCH /v1/shelters/{id} success application/json $.address.street#maxLength` — expected `120`
- **missing** `GET /v1/shelters/{id}/stats param query:year $#integer` — expected `true`
- **missing** `POST /v1/shelters/{shelterId}/cats body application/json $.name#maxLength` — expected `50`
- **missing** `POST /v1/shelters/{shelterId}/cats body application/json $.weightKg#minimum` — expected `0`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.name#maxLength` — expected `50`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.weightKg#minimum` — expected `0`
- **missing** `POST /v1/shelters/{shelterId}/dogs body application/json $.name#maxLength` — expected `50`
- **missing** `POST /v1/shelters/{shelterId}/dogs body application/json $.weightKg#minimum` — expected `0`
- **missing** `GET /v1/shelters/{shelterId}/animals param query:name $#maxLength` — expected `50`
- **missing** `GET /v1/shelters/{shelterId}/animals param query:minAge $#integer` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/animals param query:minAge $#minimum` — expected `0`
- **missing** `GET /v1/shelters/{shelterId}/animals param query:includeAdopted $#default` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/adoptions success application/json $.resources[].adopter.firstName#maxLength` — expected `80`
- **missing** `GET /v1/shelters/{shelterId}/adoptions success application/json $.resources[].adopter.lastName#maxLength` — expected `80`
- **missing** `GET /v1/shelters/{shelterId}/adoptions success application/json $.resources[].adopter.email#format` — expected `email`
- **missing** `POST /v1/shelters/{shelterId}/adoptions body application/json $.adopter.firstName#maxLength` — expected `80`
- **missing** `POST /v1/shelters/{shelterId}/adoptions body application/json $.adopter.lastName#maxLength` — expected `80`
- **missing** `POST /v1/shelters/{shelterId}/adoptions body application/json $.adopter.email#format` — expected `email`
- **missing** `POST /v1/shelters/{shelterId}/adoptions body application/json $.fee#minimum` — expected `0`
- **missing** `POST /v1/shelters/{shelterId}/adoptions body application/json $.notes#maxLength` — expected `500`
- **missing** `GET /v1/shelters/{shelterId}/adoptions/{adoptionId} success application/json $.adopter.firstName#maxLength` — expected `80`
- **missing** `GET /v1/shelters/{shelterId}/adoptions/{adoptionId} success application/json $.adopter.lastName#maxLength` — expected `80`
- **missing** `GET /v1/shelters/{shelterId}/adoptions/{adoptionId} success application/json $.adopter.email#format` — expected `email`
- **missing** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/approve success application/json $.adopter.firstName#maxLength` — expected `80`
- **missing** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/approve success application/json $.adopter.lastName#maxLength` — expected `80`
- **missing** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/approve success application/json $.adopter.email#format` — expected `email`
- **missing** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject body application/json $.reason#minLength` — expected `10`
- **missing** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject body application/json $.reason#maxLength` — expected `500`
- **missing** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject success application/json $.adopter.firstName#maxLength` — expected `80`
- **missing** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject success application/json $.adopter.lastName#maxLength` — expected `80`
- **missing** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject success application/json $.adopter.email#format` — expected `email`
- **missing** `GET /v1/books success application/json $.resources[].authors[].birthYear#integer` — expected `true`
- **missing** `GET /v1/books success application/json $.resources[].authors[].birthYear#minimum` — expected `1000`
- **missing** `GET /v1/books success application/json $.resources[].authors[].birthYear#maximum` — expected `2100`
- **missing** `POST /v1/books body application/json $.authors#minItems` — expected `1`
- **missing** `POST /v1/books body application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `POST /v1/books body application/json $.authors[].birthYear#minimum` — expected `1000`
- **missing** `POST /v1/books body application/json $.authors[].birthYear#maximum` — expected `2100`
- **missing** `POST /v1/books body application/json $.pageCount#integer` — expected `true`
- **missing** `POST /v1/books body application/json $.pageCount#minimum` — expected `1`
- **missing** `POST /v1/books body application/json $.language#minLength` — expected `2`
- **missing** `POST /v1/books body application/json $.language#maxLength` — expected `2`
- **missing** `POST /v1/books body application/json $.rating#minimum` — expected `0`
- **missing** `POST /v1/books body application/json $.rating#maximum` — expected `5`
- **missing** `POST /v1/books success application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `POST /v1/books success application/json $.authors[].birthYear#minimum` — expected `1000`
- **missing** `POST /v1/books success application/json $.authors[].birthYear#maximum` — expected `2100`
- **missing** `GET /v1/books/{isbn} success application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `GET /v1/books/{isbn} success application/json $.authors[].birthYear#minimum` — expected `1000`
- **missing** `GET /v1/books/{isbn} success application/json $.authors[].birthYear#maximum` — expected `2100`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors#minItems` — expected `1`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors[].birthYear#minimum` — expected `1000`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors[].birthYear#maximum` — expected `2100`
- **missing** `PUT /v1/books/{isbn} body application/json $.pageCount#integer` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.pageCount#minimum` — expected `1`
- **missing** `PUT /v1/books/{isbn} body application/json $.language#minLength` — expected `2`
- **missing** `PUT /v1/books/{isbn} body application/json $.language#maxLength` — expected `2`
- **missing** `PUT /v1/books/{isbn} body application/json $.rating#minimum` — expected `0`
- **missing** `PUT /v1/books/{isbn} body application/json $.rating#maximum` — expected `5`
- **missing** `PUT /v1/books/{isbn} success application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `PUT /v1/books/{isbn} success application/json $.authors[].birthYear#minimum` — expected `1000`
- **missing** `PUT /v1/books/{isbn} success application/json $.authors[].birthYear#maximum` — expected `2100`

</details>

## security (1)

Most frequent:

- ×1 `missing `

<details><summary>All</summary>

- **missing** `GET /v1/books/export#secured` — expected `false`

</details>

## docs (1)

Most frequent:

- ×1 `missing `

<details><summary>All</summary>

- **missing** `GET /v1/books/export#summary` — expected `Export the whole catalogue as CSV`

</details>

