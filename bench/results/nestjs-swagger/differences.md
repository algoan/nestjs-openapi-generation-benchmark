# @nestjs/swagger: differences with the expected document

## constraints (14)

Most frequent:

- ×3 `missing success $.authors[].birthYear#integer`
- ×2 `missing body $.capacity#integer`
- ×2 `missing body $.tags#maxItems`
- ×2 `missing body $.authors[].birthYear#integer`
- ×2 `missing body $.pageCount#integer`
- ×1 `missing param query:year $#integer`
- ×1 `missing param query:minAge $#integer`
- ×1 `missing success $.resources[].authors[].birthYear#integer`

<details><summary>All</summary>

- **missing** `POST /v1/shelters body application/json $.capacity#integer` — expected `true`
- **missing** `POST /v1/shelters body application/json $.tags#maxItems` — expected `10`
- **missing** `PATCH /v1/shelters/{id} body application/json $.capacity#integer` — expected `true`
- **missing** `PATCH /v1/shelters/{id} body application/json $.tags#maxItems` — expected `10`
- **missing** `GET /v1/shelters/{id}/stats param query:year $#integer` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/animals param query:minAge $#integer` — expected `true`
- **missing** `GET /v1/books success application/json $.resources[].authors[].birthYear#integer` — expected `true`
- **missing** `POST /v1/books body application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `POST /v1/books body application/json $.pageCount#integer` — expected `true`
- **missing** `POST /v1/books success application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `GET /v1/books/{isbn} success application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors[].birthYear#integer` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.pageCount#integer` — expected `true`
- **missing** `PUT /v1/books/{isbn} success application/json $.authors[].birthYear#integer` — expected `true`

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

