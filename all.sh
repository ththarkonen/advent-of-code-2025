#!/bin/sh
> "README.md"
echo "| Problem | Wall time |" >> "README.md"
echo "| --- | ---|" >> "README.md"
for ii in $(seq 1 12);
do
    output=$(npm run ts-node day$ii/main.ts)
    fifth_line="$(printf "%s\n" "$output" | sed -n '5p')"
    time="${fifth_line#Solution: }"

    # Add leading space if ii < 10
    padded="$(printf '%02d' "$ii")"
    time_aligned="$(printf '%10s' "$time")"

    echo "Day $padded: $time_aligned"
    echo "| Day $padded | $time_aligned |" >> "README.md"
done