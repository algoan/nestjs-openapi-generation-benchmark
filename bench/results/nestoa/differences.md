# nestoa: differences with the expected document

## parameters (61)

Most frequent:

- ×5 `missing param query:page`
- ×5 `missing param query:page#required`
- ×5 `missing param query:page $#type`
- ×5 `missing param query:limit`
- ×5 `missing param query:limit#required`
- ×5 `missing param query:limit $#type`
- ×5 `missing param query:filter`
- ×5 `missing param query:filter#required`
- ×5 `missing param query:filter $#type`
- ×5 `missing param query:sort`
- ×5 `missing param query:sort#required`
- ×5 `missing param query:sort $#type`
- ×1 `mismatch param query:includeAdopted#required`

<details><summary>All</summary>

- **missing** `GET /v1/shelters param query:page` — expected `true`
- **missing** `GET /v1/shelters param query:page#required` — expected `false`
- **missing** `GET /v1/shelters param query:page $#type` — expected `number`
- **missing** `GET /v1/shelters param query:limit` — expected `true`
- **missing** `GET /v1/shelters param query:limit#required` — expected `false`
- **missing** `GET /v1/shelters param query:limit $#type` — expected `number`
- **missing** `GET /v1/shelters param query:filter` — expected `true`
- **missing** `GET /v1/shelters param query:filter#required` — expected `false`
- **missing** `GET /v1/shelters param query:filter $#type` — expected `string`
- **missing** `GET /v1/shelters param query:sort` — expected `true`
- **missing** `GET /v1/shelters param query:sort#required` — expected `false`
- **missing** `GET /v1/shelters param query:sort $#type` — expected `string`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:page` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:page#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:page $#type` — expected `number`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:limit` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:limit#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:limit $#type` — expected `number`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:filter` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:filter#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:filter $#type` — expected `string`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:sort` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:sort#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:sort $#type` — expected `string`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:page` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:page#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:page $#type` — expected `number`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:limit` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:limit#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:limit $#type` — expected `number`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:filter` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:filter#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:filter $#type` — expected `string`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:sort` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:sort#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:sort $#type` — expected `string`
- **mismatch** `GET /v1/shelters/{shelterId}/animals param query:includeAdopted#required` — expected `false`, got `true`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:page` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:page#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:page $#type` — expected `number`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:limit` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:limit#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:limit $#type` — expected `number`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:filter` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:filter#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:filter $#type` — expected `string`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:sort` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:sort#required` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:sort $#type` — expected `string`
- **missing** `GET /v1/books param query:page` — expected `true`
- **missing** `GET /v1/books param query:page#required` — expected `false`
- **missing** `GET /v1/books param query:page $#type` — expected `number`
- **missing** `GET /v1/books param query:limit` — expected `true`
- **missing** `GET /v1/books param query:limit#required` — expected `false`
- **missing** `GET /v1/books param query:limit $#type` — expected `number`
- **missing** `GET /v1/books param query:filter` — expected `true`
- **missing** `GET /v1/books param query:filter#required` — expected `false`
- **missing** `GET /v1/books param query:filter $#type` — expected `string`
- **missing** `GET /v1/books param query:sort` — expected `true`
- **missing** `GET /v1/books param query:sort#required` — expected `false`
- **missing** `GET /v1/books param query:sort $#type` — expected `string`

</details>

## requestBody (84)

Most frequent:

- ×2 `missing body $.name#required`
- ×2 `missing body $.name#type`
- ×1 `missing body $.address#required`
- ×1 `missing body $.address#type`
- ×1 `missing body $.address.street#required`
- ×1 `missing body $.address.street#type`
- ×1 `missing body $.address.city#required`
- ×1 `missing body $.address.city#type`
- ×1 `missing body $.address.postalCode#required`
- ×1 `missing body $.address.postalCode#type`
- ×1 `missing body $.address.complement#required`
- ×1 `missing body $.address.complement#type`
- ×1 `missing body $.email#required`
- ×1 `missing body $.email#type`
- ×1 `missing body $.capacity#required`

<details><summary>All</summary>

- **missing** `PATCH /v1/shelters/{id} body application/json $.name#required` — expected `false`
- **missing** `PATCH /v1/shelters/{id} body application/json $.name#type` — expected `string`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address#required` — expected `false`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address#type` — expected `object`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.street#required` — expected `true`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.street#type` — expected `string`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.city#required` — expected `true`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.city#type` — expected `string`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.postalCode#required` — expected `true`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.postalCode#type` — expected `string`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.complement#required` — expected `false`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.complement#type` — expected `string`
- **missing** `PATCH /v1/shelters/{id} body application/json $.email#required` — expected `false`
- **missing** `PATCH /v1/shelters/{id} body application/json $.email#type` — expected `string`
- **missing** `PATCH /v1/shelters/{id} body application/json $.capacity#required` — expected `false`
- **missing** `PATCH /v1/shelters/{id} body application/json $.capacity#type` — expected `number`
- **missing** `PATCH /v1/shelters/{id} body application/json $.tags#required` — expected `false`
- **missing** `PATCH /v1/shelters/{id} body application/json $.tags#type` — expected `array`
- **missing** `PATCH /v1/shelters/{id} body application/json $.tags[]#type` — expected `string`
- **missing** `PATCH /v1/shelters/{id} body application/json $.metadata#required` — expected `false`
- **missing** `PATCH /v1/shelters/{id} body application/json $.metadata#type` — expected `object`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.name#required` — expected `false`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.name#type` — expected `string`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.birthDate#required` — expected `false`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.birthDate#type` — expected `string`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.birthDate#format` — expected `date-time`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.sex#required` — expected `false`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.sex#type` — expected `string`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.sex#enum="FEMALE"` — expected `true`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.sex#enum="MALE"` — expected `true`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.sex#enum="UNKNOWN"` — expected `true`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations#required` — expected `false`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations#type` — expected `array`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[]#type` — expected `object`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].name#required` — expected `true`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].name#type` — expected `string`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].date#required` — expected `true`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].date#type` — expected `string`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].date#format` — expected `date-time`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].expiresAt#required` — expected `false`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].expiresAt#type` — expected `string`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].expiresAt#format` — expected `date-time`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.weightKg#required` — expected `false`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.weightKg#type` — expected `number`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.indoor#required` — expected `false`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.indoor#type` — expected `boolean`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.coatPattern#required` — expected `false`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.coatPattern#type` — expected `string`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.coatPattern#enum="SOLID"` — expected `true`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.coatPattern#enum="TABBY"` — expected `true`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.coatPattern#enum="TORTOISESHELL"` — expected `true`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.coatPattern#enum="CALICO"` — expected `true`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.coatPattern#enum="BICOLOR"` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.title#required` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.title#type` — expected `string`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors#required` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors#type` — expected `array`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors[]#type` — expected `object`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors[].name#required` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors[].name#type` — expected `string`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors[].birthYear#required` — expected `false`
- **missing** `PUT /v1/books/{isbn} body application/json $.authors[].birthYear#type` — expected `number`
- **missing** `PUT /v1/books/{isbn} body application/json $.genre#required` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.genre#type` — expected `string`
- **missing** `PUT /v1/books/{isbn} body application/json $.genre#enum="CARE_GUIDE"` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.genre#enum="TRAINING"` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.genre#enum="NOVEL"` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.genre#enum="CHILDREN"` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.publishedOn#required` — expected `false`
- **missing** `PUT /v1/books/{isbn} body application/json $.publishedOn#type` — expected `string`
- **missing** `PUT /v1/books/{isbn} body application/json $.publishedOn#format` — expected `date-time`
- **missing** `PUT /v1/books/{isbn} body application/json $.pageCount#required` — expected `false`
- **missing** `PUT /v1/books/{isbn} body application/json $.pageCount#type` — expected `number`
- **missing** `PUT /v1/books/{isbn} body application/json $.language#required` — expected `false`
- **missing** `PUT /v1/books/{isbn} body application/json $.language#type` — expected `string`
- **missing** `PUT /v1/books/{isbn} body application/json $.topics#required` — expected `false`
- **missing** `PUT /v1/books/{isbn} body application/json $.topics#type` — expected `array`
- **missing** `PUT /v1/books/{isbn} body application/json $.topics[]#type` — expected `string`
- **missing** `PUT /v1/books/{isbn} body application/json $.topics[]#enum="CAT"` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.topics[]#enum="DOG"` — expected `true`
- **missing** `PUT /v1/books/{isbn} body application/json $.rating#required` — expected `false`
- **missing** `PUT /v1/books/{isbn} body application/json $.rating#type` — expected `number`
- **missing** `PUT /v1/books/{isbn} body application/json $.available#required` — expected `false`
- **missing** `PUT /v1/books/{isbn} body application/json $.available#type` — expected `boolean`

</details>

## responses (4)

Most frequent:

- ×1 `missing success text/csv`
- ×1 `missing success $#type`
- ×1 `extra success application/json`
- ×1 `extra success $#type`

<details><summary>All</summary>

- **missing** `GET /v1/books/export success text/csv` — expected `true`
- **missing** `GET /v1/books/export success text/csv $#type` — expected `string`
- **extra** `GET /v1/books/export success application/json` — got `true`
- **extra** `GET /v1/books/export success application/json $#type` — got `string`

</details>

## constraints (192)

Most frequent:

- ×25 `extra 401 $.status#integer`
- ×25 `extra 403 $.status#integer`
- ×23 `extra 404 $.status#integer`
- ×16 `extra 400 $.status#integer`
- ×5 `missing param query:page $#integer`
- ×5 `missing param query:page $#default`
- ×5 `missing param query:limit $#integer`
- ×5 `missing param query:limit $#default`
- ×5 `missing body $.name#maxLength`
- ×3 `missing success $.address.street#maxLength`
- ×3 `missing body $.weightKg#minimum`
- ×3 `missing success $.adopter.firstName#maxLength`
- ×3 `missing success $.adopter.lastName#maxLength`
- ×3 `missing success $.adopter.email#format`
- ×3 `missing success $.authors[].birthYear#integer`

<details><summary>All</summary>

- **missing** `GET /v1/shelters param query:page $#integer` — expected `true`
- **missing** `GET /v1/shelters param query:page $#default` — expected `1`
- **missing** `GET /v1/shelters param query:limit $#integer` — expected `true`
- **missing** `GET /v1/shelters param query:limit $#default` — expected `10`
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
- **missing** `GET /v1/shelters/{shelterId}/cats param query:page $#integer` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:page $#default` — expected `1`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:limit $#integer` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/cats param query:limit $#default` — expected `10`
- **missing** `POST /v1/shelters/{shelterId}/cats body application/json $.name#maxLength` — expected `50`
- **missing** `POST /v1/shelters/{shelterId}/cats body application/json $.weightKg#minimum` — expected `0`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.name#maxLength` — expected `50`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.weightKg#minimum` — expected `0`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:page $#integer` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:page $#default` — expected `1`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:limit $#integer` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/dogs param query:limit $#default` — expected `10`
- **missing** `POST /v1/shelters/{shelterId}/dogs body application/json $.name#maxLength` — expected `50`
- **missing** `POST /v1/shelters/{shelterId}/dogs body application/json $.weightKg#minimum` — expected `0`
- **missing** `GET /v1/shelters/{shelterId}/animals param query:name $#maxLength` — expected `50`
- **missing** `GET /v1/shelters/{shelterId}/animals param query:minAge $#integer` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/animals param query:minAge $#minimum` — expected `0`
- **missing** `GET /v1/shelters/{shelterId}/animals param query:includeAdopted $#default` — expected `false`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:page $#integer` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:page $#default` — expected `1`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:limit $#integer` — expected `true`
- **missing** `GET /v1/shelters/{shelterId}/adoptions param query:limit $#default` — expected `10`
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
- **missing** `GET /v1/books param query:page $#integer` — expected `true`
- **missing** `GET /v1/books param query:page $#default` — expected `1`
- **missing** `GET /v1/books param query:limit $#integer` — expected `true`
- **missing** `GET /v1/books param query:limit $#default` — expected `10`
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
- **extra** `GET /v1/books 400 application/json $.status#integer` — got `true`
- **extra** `POST /v1/books 400 application/json $.status#integer` — got `true`
- **extra** `POST /v1/books 401 application/json $.status#integer` — got `true`
- **extra** `POST /v1/books 403 application/json $.status#integer` — got `true`
- **extra** `POST /v1/books 409 application/json $.status#integer` — got `true`
- **extra** `GET /v1/books/{isbn} 404 application/json $.status#integer` — got `true`
- **extra** `PUT /v1/books/{isbn} 400 application/json $.status#integer` — got `true`
- **extra** `PUT /v1/books/{isbn} 401 application/json $.status#integer` — got `true`
- **extra** `PUT /v1/books/{isbn} 403 application/json $.status#integer` — got `true`
- **extra** `PUT /v1/books/{isbn} 404 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/books/{isbn} 401 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/books/{isbn} 403 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/books/{isbn} 404 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters 400 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters 403 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters 400 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters 401 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{id} 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{id} 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{id} 404 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/shelters/{id} 401 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/shelters/{id} 403 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/shelters/{id} 404 application/json $.status#integer` — got `true`
- **extra** `PATCH /v1/shelters/{id} 400 application/json $.status#integer` — got `true`
- **extra** `PATCH /v1/shelters/{id} 401 application/json $.status#integer` — got `true`
- **extra** `PATCH /v1/shelters/{id} 403 application/json $.status#integer` — got `true`
- **extra** `PATCH /v1/shelters/{id} 404 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{id}/stats 400 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{id}/stats 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{id}/stats 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{id}/stats 404 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/adoptions 400 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/adoptions 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/adoptions 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/adoptions 404 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions 400 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions 401 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions 403 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions 404 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/adoptions/{adoptionId} 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/adoptions/{adoptionId} 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/adoptions/{adoptionId} 404 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/shelters/{shelterId}/adoptions/{adoptionId} 401 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/shelters/{shelterId}/adoptions/{adoptionId} 403 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/shelters/{shelterId}/adoptions/{adoptionId} 404 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/approve 401 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/approve 403 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/approve 404 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/approve 409 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject 400 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject 401 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject 403 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject 404 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject 409 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/animals 400 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/animals 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/animals 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/animals 404 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/animals/{animalId} 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/animals/{animalId} 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/animals/{animalId} 404 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/cats 400 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/cats 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/cats 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/cats 404 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/cats 400 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/cats 401 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/cats 403 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/cats 404 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/cats/{catId} 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/cats/{catId} 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/cats/{catId} 404 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/shelters/{shelterId}/cats/{catId} 401 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/shelters/{shelterId}/cats/{catId} 403 application/json $.status#integer` — got `true`
- **extra** `DELETE /v1/shelters/{shelterId}/cats/{catId} 404 application/json $.status#integer` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} 400 application/json $.status#integer` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} 401 application/json $.status#integer` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} 403 application/json $.status#integer` — got `true`
- **extra** `PATCH /v1/shelters/{shelterId}/cats/{catId} 404 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/dogs 400 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/dogs 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/dogs 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/dogs 404 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/dogs 400 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/dogs 401 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/dogs 403 application/json $.status#integer` — got `true`
- **extra** `POST /v1/shelters/{shelterId}/dogs 404 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/dogs/{dogId} 401 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/dogs/{dogId} 403 application/json $.status#integer` — got `true`
- **extra** `GET /v1/shelters/{shelterId}/dogs/{dogId} 404 application/json $.status#integer` — got `true`

</details>

## security (25)

Most frequent:

- ×25 `mismatch `

<details><summary>All</summary>

- **mismatch** `GET /v1/shelters#secured` — expected `true`, got `false`
- **mismatch** `POST /v1/shelters#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{id}#secured` — expected `true`, got `false`
- **mismatch** `DELETE /v1/shelters/{id}#secured` — expected `true`, got `false`
- **mismatch** `PATCH /v1/shelters/{id}#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{id}/stats#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{shelterId}/cats#secured` — expected `true`, got `false`
- **mismatch** `POST /v1/shelters/{shelterId}/cats#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{shelterId}/cats/{catId}#secured` — expected `true`, got `false`
- **mismatch** `DELETE /v1/shelters/{shelterId}/cats/{catId}#secured` — expected `true`, got `false`
- **mismatch** `PATCH /v1/shelters/{shelterId}/cats/{catId}#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{shelterId}/dogs#secured` — expected `true`, got `false`
- **mismatch** `POST /v1/shelters/{shelterId}/dogs#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{shelterId}/dogs/{dogId}#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{shelterId}/animals#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{shelterId}/animals/{animalId}#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{shelterId}/adoptions#secured` — expected `true`, got `false`
- **mismatch** `POST /v1/shelters/{shelterId}/adoptions#secured` — expected `true`, got `false`
- **mismatch** `GET /v1/shelters/{shelterId}/adoptions/{adoptionId}#secured` — expected `true`, got `false`
- **mismatch** `DELETE /v1/shelters/{shelterId}/adoptions/{adoptionId}#secured` — expected `true`, got `false`
- **mismatch** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/approve#secured` — expected `true`, got `false`
- **mismatch** `POST /v1/shelters/{shelterId}/adoptions/{adoptionId}/reject#secured` — expected `true`, got `false`
- **mismatch** `POST /v1/books#secured` — expected `true`, got `false`
- **mismatch** `PUT /v1/books/{isbn}#secured` — expected `true`, got `false`
- **mismatch** `DELETE /v1/books/{isbn}#secured` — expected `true`, got `false`

</details>

## docs (11)

Most frequent:

- ×1 `missing body $.name#description`
- ×1 `missing body $.address.complement#description`
- ×1 `missing body $.email#description`
- ×1 `missing body $.capacity#description`
- ×1 `missing body $.metadata#description`
- ×1 `missing body $.vaccinations[].name#description`
- ×1 `missing body $.weightKg#description`
- ×1 `missing body $.indoor#description`
- ×1 `missing body $.language#description`
- ×1 `missing body $.topics#description`
- ×1 `missing body $.rating#description`

<details><summary>All</summary>

- **missing** `PATCH /v1/shelters/{id} body application/json $.name#description` — expected `Display name of the shelter`
- **missing** `PATCH /v1/shelters/{id} body application/json $.address.complement#description` — expected `Building, floor, etc.`
- **missing** `PATCH /v1/shelters/{id} body application/json $.email#description` — expected `Contact email`
- **missing** `PATCH /v1/shelters/{id} body application/json $.capacity#description` — expected `Maximum number of animals the shelter can host`
- **missing** `PATCH /v1/shelters/{id} body application/json $.metadata#description` — expected `Free-form data attached by the caller`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.vaccinations[].name#description` — expected `Vaccine name`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.weightKg#description` — expected `Weight in kilograms`
- **missing** `PATCH /v1/shelters/{shelterId}/cats/{catId} body application/json $.indoor#description` — expected `Whether the cat must live indoors`
- **missing** `PUT /v1/books/{isbn} body application/json $.language#description` — expected `ISO 639-1 language code`
- **missing** `PUT /v1/books/{isbn} body application/json $.topics#description` — expected `Species the book is about`
- **missing** `PUT /v1/books/{isbn} body application/json $.rating#description` — expected `Average reader rating, from 0 to 5`

</details>

