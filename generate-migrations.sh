#!/bin/bash

entities=(
  "Digifranchise"
  "FranchiseOwnership"
  "DigifranchiseProduct"
  "DigifranchiseServiceOffer"
)

for entity in "${entities[@]}"; do
  npm run migration:generate:custom -- -n "Create${entity}Table"
done