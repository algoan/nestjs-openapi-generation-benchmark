# ts-oas: differences with the expected document

## parameters (3)

Most frequent:

- ×1 `missing param header:x-request-id`
- ×1 `missing param header:x-request-id#required`
- ×1 `missing param header:x-request-id $#type`

<details><summary>All</summary>

- **missing** `POST /v1/shelters/{shelterId}/adoptions param header:x-request-id` — expected `true`
- **missing** `POST /v1/shelters/{shelterId}/adoptions param header:x-request-id#required` — expected `false`
- **missing** `POST /v1/shelters/{shelterId}/adoptions param header:x-request-id $#type` — expected `string`

</details>

## docs (1)

Most frequent:

- ×1 `missing param header:x-request-id#description`

<details><summary>All</summary>

- **missing** `POST /v1/shelters/{shelterId}/adoptions param header:x-request-id#description` — expected `Correlation id, echoed in the logs`

</details>

