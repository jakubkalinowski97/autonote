#!/bin/bash

set -e

# Script to generate Supabase TypeScript types from the local database
# Usage: ./tools/scripts/generate-supabase-types.sh

OUTPUT_PATH="libs/shared/src/lib/supabase.ts"
SCHEMAS="public,auth"

# Check for Supabase CLI
if ! command -v supabase &> /dev/null; then
  echo "Supabase CLI not found. Please install it first: https://supabase.com/docs/guides/cli"
  exit 1
fi

# Ensure output directory exists
OUTPUT_DIR=$(dirname "$OUTPUT_PATH")
if [ ! -d "$OUTPUT_DIR" ]; then
  echo "Creating output directory: $OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR"
fi

# Generate types
echo "Generating Supabase types for schemas: $SCHEMAS ..."
supabase gen types typescript --local --schema $SCHEMAS > "$OUTPUT_PATH"

if [ $? -eq 0 ]; then
  echo "✅ Supabase types generated at $OUTPUT_PATH"
else
  echo "❌ Failed to generate Supabase types."
  exit 1
fi 