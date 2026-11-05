# asyncapi-decorators: differences with the expected document

## payloads (33)

Most frequent:

- ×4 `mismatch $.shelterId#required`
- ×3 `mismatch $.adoptionId#required`
- ×3 `mismatch $.isbn#required`
- ×2 `mismatch $.animalId#required`
- ×1 `mismatch $.vaccination#required`
- ×1 `mismatch $.vaccination.name#required`
- ×1 `mismatch $.vaccination.date#required`
- ×1 `mismatch $.species#required`
- ×1 `mismatch $.adopter#required`
- ×1 `mismatch $.adopter.firstName#required`
- ×1 `mismatch $.adopter.lastName#required`
- ×1 `mismatch $.adopter.email#required`
- ×1 `mismatch $.fee#required`
- ×1 `mismatch $.status#required`
- ×1 `mismatch $.decidedAt#required`

<details><summary>All</summary>

- **mismatch** `receive adoption_completed $.adoptionId#required` — expected `true`, got `false`
- **mismatch** `receive adoption_completed $.shelterId#required` — expected `true`, got `false`
- **mismatch** `receive vaccination_recorded $.shelterId#required` — expected `true`, got `false`
- **mismatch** `receive vaccination_recorded $.animalId#required` — expected `true`, got `false`
- **mismatch** `receive vaccination_recorded $.vaccination#required` — expected `true`, got `false`
- **mismatch** `receive vaccination_recorded $.vaccination.name#required` — expected `true`, got `false`
- **mismatch** `receive vaccination_recorded $.vaccination.date#required` — expected `true`, got `false`
- **mismatch** `receive book_restocked $.isbn#required` — expected `true`, got `false`
- **mismatch** `receive book_sold_out $.isbn#required` — expected `true`, got `false`
- **mismatch** `send adoption_requested $.adoptionId#required` — expected `true`, got `false`
- **mismatch** `send adoption_requested $.shelterId#required` — expected `true`, got `false`
- **mismatch** `send adoption_requested $.animalId#required` — expected `true`, got `false`
- **mismatch** `send adoption_requested $.species#required` — expected `true`, got `false`
- **mismatch** `send adoption_requested $.adopter#required` — expected `true`, got `false`
- **mismatch** `send adoption_requested $.adopter.firstName#required` — expected `true`, got `false`
- **mismatch** `send adoption_requested $.adopter.lastName#required` — expected `true`, got `false`
- **mismatch** `send adoption_requested $.adopter.email#required` — expected `true`, got `false`
- **mismatch** `send adoption_requested $.fee#required` — expected `true`, got `false`
- **mismatch** `send adoption_decided $.adoptionId#required` — expected `true`, got `false`
- **mismatch** `send adoption_decided $.shelterId#required` — expected `true`, got `false`
- **mismatch** `send adoption_decided $.status#required` — expected `true`, got `false`
- **mismatch** `send adoption_decided $.decidedAt#required` — expected `true`, got `false`
- **mismatch** `send book_published $._id#required` — expected `true`, got `false`
- **mismatch** `send book_published $.isbn#required` — expected `true`, got `false`
- **mismatch** `send book_published $.title#required` — expected `true`, got `false`
- **mismatch** `send book_published $.authors#required` — expected `true`, got `false`
- **mismatch** `send book_published $.authors[].name#required` — expected `true`, got `false`
- **mismatch** `send book_published $.genre#required` — expected `true`, got `false`
- **mismatch** `send book_published $.language#required` — expected `true`, got `false`
- **mismatch** `send book_published $.topics#required` — expected `true`, got `false`
- **mismatch** `send book_published $.available#required` — expected `true`, got `false`
- **mismatch** `send book_published $.createdAt#required` — expected `true`, got `false`
- **mismatch** `send book_published $.updatedAt#required` — expected `true`, got `false`

</details>

