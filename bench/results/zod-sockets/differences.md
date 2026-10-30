# zod-sockets: differences with the expected document

## operations (14)

Most frequent:

- ×7 `missing `
- ×7 `extra `

<details><summary>All</summary>

- **missing** `receive adoption_completed` — expected `true`
- **missing** `receive vaccination_recorded` — expected `true`
- **missing** `receive book_restocked` — expected `true`
- **missing** `receive book_sold_out` — expected `true`
- **missing** `send adoption_requested` — expected `true`
- **missing** `send adoption_decided` — expected `true`
- **missing** `send book_published` — expected `true`
- **extra** `send /` — got `true`
- **extra** `send /` — got `true`
- **extra** `send /` — got `true`
- **extra** `receive /` — got `true`
- **extra** `receive /` — got `true`
- **extra** `receive /` — got `true`
- **extra** `receive /` — got `true`

</details>

## payloads (117)

Most frequent:

- ×7 `missing $#type`
- ×7 `extra $#type`
- ×4 `missing $.shelterId#required`
- ×4 `missing $.shelterId#type`
- ×3 `missing $.adoptionId#required`
- ×3 `missing $.adoptionId#type`
- ×3 `missing $.isbn#required`
- ×3 `missing $.isbn#type`
- ×2 `missing $.animalId#required`
- ×2 `missing $.animalId#type`
- ×2 `missing $.stock#required`
- ×2 `missing $.stock#type`
- ×1 `missing $.vaccination#required`
- ×1 `missing $.vaccination#type`
- ×1 `missing $.vaccination.name#required`

<details><summary>All</summary>

- **missing** `receive adoption_completed $#type` — expected `object`
- **missing** `receive adoption_completed $.adoptionId#required` — expected `true`
- **missing** `receive adoption_completed $.adoptionId#type` — expected `string`
- **missing** `receive adoption_completed $.shelterId#required` — expected `true`
- **missing** `receive adoption_completed $.shelterId#type` — expected `string`
- **missing** `receive vaccination_recorded $#type` — expected `object`
- **missing** `receive vaccination_recorded $.shelterId#required` — expected `true`
- **missing** `receive vaccination_recorded $.shelterId#type` — expected `string`
- **missing** `receive vaccination_recorded $.animalId#required` — expected `true`
- **missing** `receive vaccination_recorded $.animalId#type` — expected `string`
- **missing** `receive vaccination_recorded $.vaccination#required` — expected `true`
- **missing** `receive vaccination_recorded $.vaccination#type` — expected `object`
- **missing** `receive vaccination_recorded $.vaccination.name#required` — expected `true`
- **missing** `receive vaccination_recorded $.vaccination.name#type` — expected `string`
- **missing** `receive vaccination_recorded $.vaccination.date#required` — expected `true`
- **missing** `receive vaccination_recorded $.vaccination.date#type` — expected `string`
- **missing** `receive vaccination_recorded $.vaccination.date#format` — expected `date-time`
- **missing** `receive vaccination_recorded $.vaccination.expiresAt#required` — expected `false`
- **missing** `receive vaccination_recorded $.vaccination.expiresAt#type` — expected `string`
- **missing** `receive vaccination_recorded $.vaccination.expiresAt#format` — expected `date-time`
- **missing** `receive book_restocked $#type` — expected `object`
- **missing** `receive book_restocked $.isbn#required` — expected `true`
- **missing** `receive book_restocked $.isbn#type` — expected `string`
- **missing** `receive book_restocked $.stock#required` — expected `false`
- **missing** `receive book_restocked $.stock#type` — expected `number`
- **missing** `receive book_sold_out $#type` — expected `object`
- **missing** `receive book_sold_out $.isbn#required` — expected `true`
- **missing** `receive book_sold_out $.isbn#type` — expected `string`
- **missing** `receive book_sold_out $.stock#required` — expected `false`
- **missing** `receive book_sold_out $.stock#type` — expected `number`
- **missing** `send adoption_requested $#type` — expected `object`
- **missing** `send adoption_requested $.adoptionId#required` — expected `true`
- **missing** `send adoption_requested $.adoptionId#type` — expected `string`
- **missing** `send adoption_requested $.shelterId#required` — expected `true`
- **missing** `send adoption_requested $.shelterId#type` — expected `string`
- **missing** `send adoption_requested $.animalId#required` — expected `true`
- **missing** `send adoption_requested $.animalId#type` — expected `string`
- **missing** `send adoption_requested $.species#required` — expected `true`
- **missing** `send adoption_requested $.species#type` — expected `string`
- **missing** `send adoption_requested $.species#enum="CAT"` — expected `true`
- **missing** `send adoption_requested $.species#enum="DOG"` — expected `true`
- **missing** `send adoption_requested $.adopter#required` — expected `true`
- **missing** `send adoption_requested $.adopter#type` — expected `object`
- **missing** `send adoption_requested $.adopter.firstName#required` — expected `true`
- **missing** `send adoption_requested $.adopter.firstName#type` — expected `string`
- **missing** `send adoption_requested $.adopter.lastName#required` — expected `true`
- **missing** `send adoption_requested $.adopter.lastName#type` — expected `string`
- **missing** `send adoption_requested $.adopter.email#required` — expected `true`
- **missing** `send adoption_requested $.adopter.email#type` — expected `string`
- **missing** `send adoption_requested $.adopter.phone#required` — expected `false`
- **missing** `send adoption_requested $.adopter.phone#type` — expected `string`
- **missing** `send adoption_requested $.fee#required` — expected `true`
- **missing** `send adoption_requested $.fee#type` — expected `number`
- **missing** `send adoption_decided $#type` — expected `object`
- **missing** `send adoption_decided $.adoptionId#required` — expected `true`
- **missing** `send adoption_decided $.adoptionId#type` — expected `string`
- **missing** `send adoption_decided $.shelterId#required` — expected `true`
- **missing** `send adoption_decided $.shelterId#type` — expected `string`
- **missing** `send adoption_decided $.status#required` — expected `true`
- **missing** `send adoption_decided $.status#type` — expected `string`
- **missing** `send adoption_decided $.status#enum="PENDING"` — expected `true`
- **missing** `send adoption_decided $.status#enum="APPROVED"` — expected `true`
- **missing** `send adoption_decided $.status#enum="REJECTED"` — expected `true`
- **missing** `send adoption_decided $.rejectionReason#required` — expected `false`
- **missing** `send adoption_decided $.rejectionReason#type` — expected `string`
- **missing** `send adoption_decided $.decidedAt#required` — expected `true`
- **missing** `send adoption_decided $.decidedAt#type` — expected `string`
- **missing** `send adoption_decided $.decidedAt#format` — expected `date-time`
- **missing** `send book_published $#type` — expected `object`
- **missing** `send book_published $._id#required` — expected `true`
- **missing** `send book_published $._id#type` — expected `string`
- **missing** `send book_published $.isbn#required` — expected `true`
- **missing** `send book_published $.isbn#type` — expected `string`
- **missing** `send book_published $.title#required` — expected `true`
- **missing** `send book_published $.title#type` — expected `string`
- **missing** `send book_published $.authors#required` — expected `true`
- **missing** `send book_published $.authors#type` — expected `array`
- **missing** `send book_published $.authors[]#type` — expected `object`
- **missing** `send book_published $.authors[].name#required` — expected `true`
- **missing** `send book_published $.authors[].name#type` — expected `string`
- **missing** `send book_published $.authors[].birthYear#required` — expected `false`
- **missing** `send book_published $.authors[].birthYear#type` — expected `number`
- **missing** `send book_published $.genre#required` — expected `true`
- **missing** `send book_published $.genre#type` — expected `string`
- **missing** `send book_published $.genre#enum="CARE_GUIDE"` — expected `true`
- **missing** `send book_published $.genre#enum="TRAINING"` — expected `true`
- **missing** `send book_published $.genre#enum="NOVEL"` — expected `true`
- **missing** `send book_published $.genre#enum="CHILDREN"` — expected `true`
- **missing** `send book_published $.publishedOn#required` — expected `false`
- **missing** `send book_published $.publishedOn#type` — expected `string`
- **missing** `send book_published $.publishedOn#format` — expected `date-time`
- **missing** `send book_published $.pageCount#required` — expected `false`
- **missing** `send book_published $.pageCount#type` — expected `number`
- **missing** `send book_published $.language#required` — expected `true`
- **missing** `send book_published $.language#type` — expected `string`
- **missing** `send book_published $.topics#required` — expected `true`
- **missing** `send book_published $.topics#type` — expected `array`
- **missing** `send book_published $.topics[]#type` — expected `string`
- **missing** `send book_published $.topics[]#enum="CAT"` — expected `true`
- **missing** `send book_published $.topics[]#enum="DOG"` — expected `true`
- **missing** `send book_published $.rating#required` — expected `false`
- **missing** `send book_published $.rating#type` — expected `number`
- **missing** `send book_published $.available#required` — expected `true`
- **missing** `send book_published $.available#type` — expected `boolean`
- **missing** `send book_published $.createdAt#required` — expected `true`
- **missing** `send book_published $.createdAt#type` — expected `string`
- **missing** `send book_published $.createdAt#format` — expected `date-time`
- **missing** `send book_published $.updatedAt#required` — expected `true`
- **missing** `send book_published $.updatedAt#type` — expected `string`
- **missing** `send book_published $.updatedAt#format` — expected `date-time`
- **extra** `send / $#type` — got `array`
- **extra** `send / $#type` — got `array`
- **extra** `send / $#type` — got `array`
- **extra** `receive / $#type` — got `array`
- **extra** `receive / $#type` — got `array`
- **extra** `receive / $#type` — got `array`
- **extra** `receive / $#type` — got `array`

</details>

## constraints (20)

Most frequent:

- ×7 `extra $#minItems`
- ×7 `extra $#maxItems`
- ×1 `missing $.adopter.firstName#maxLength`
- ×1 `missing $.adopter.lastName#maxLength`
- ×1 `missing $.adopter.email#format`
- ×1 `missing $.authors[].birthYear#integer`
- ×1 `missing $.authors[].birthYear#minimum`
- ×1 `missing $.authors[].birthYear#maximum`

<details><summary>All</summary>

- **missing** `send adoption_requested $.adopter.firstName#maxLength` — expected `80`
- **missing** `send adoption_requested $.adopter.lastName#maxLength` — expected `80`
- **missing** `send adoption_requested $.adopter.email#format` — expected `email`
- **missing** `send book_published $.authors[].birthYear#integer` — expected `true`
- **missing** `send book_published $.authors[].birthYear#minimum` — expected `1000`
- **missing** `send book_published $.authors[].birthYear#maximum` — expected `2100`
- **extra** `send / $#minItems` — got `1`
- **extra** `send / $#maxItems` — got `1`
- **extra** `send / $#minItems` — got `1`
- **extra** `send / $#maxItems` — got `1`
- **extra** `send / $#minItems` — got `1`
- **extra** `send / $#maxItems` — got `1`
- **extra** `receive / $#minItems` — got `1`
- **extra** `receive / $#maxItems` — got `1`
- **extra** `receive / $#minItems` — got `1`
- **extra** `receive / $#maxItems` — got `1`
- **extra** `receive / $#minItems` — got `1`
- **extra** `receive / $#maxItems` — got `1`
- **extra** `receive / $#minItems` — got `1`
- **extra** `receive / $#maxItems` — got `1`

</details>

## docs (14)

Most frequent:

- ×4 `missing `
- ×1 `missing $.vaccination.name#description`
- ×1 `missing $.adopter.phone#description`
- ×1 `missing $.fee#description`
- ×1 `missing $.rejectionReason#description`
- ×1 `missing $.isbn#description`
- ×1 `missing $.language#description`
- ×1 `missing $.topics#description`
- ×1 `missing $.rating#description`
- ×1 `missing $.createdAt#description`
- ×1 `missing $.updatedAt#description`

<details><summary>All</summary>

- **missing** `receive adoption_completed#summary` — expected `Handle the adoption_completed event`
- **missing** `receive vaccination_recorded#summary` — expected `Add a vaccination to the health record of an animal`
- **missing** `receive vaccination_recorded $.vaccination.name#description` — expected `Vaccine name`
- **missing** `receive book_restocked#summary` — expected `Update the availability of a book when the bookshop's stock changes`
- **missing** `receive book_sold_out#summary` — expected `Update the availability of a book when the bookshop's stock changes`
- **missing** `send adoption_requested $.adopter.phone#description` — expected `Phone number, in the E.164 format`
- **missing** `send adoption_requested $.fee#description` — expected `Adoption fee, in euros`
- **missing** `send adoption_decided $.rejectionReason#description` — expected `Why the request was rejected`
- **missing** `send book_published $.isbn#description` — expected `ISBN-13, without dashes`
- **missing** `send book_published $.language#description` — expected `ISO 639-1 language code`
- **missing** `send book_published $.topics#description` — expected `Species the book is about`
- **missing** `send book_published $.rating#description` — expected `Average reader rating, from 0 to 5`
- **missing** `send book_published $.createdAt#description` — expected `Value added by mongoose`
- **missing** `send book_published $.updatedAt#description` — expected `Value added by mongoose`

</details>

