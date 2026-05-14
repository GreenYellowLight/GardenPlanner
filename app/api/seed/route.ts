import db from "@/app/lib/db";

// Original plan was to use Bunnings api. Did not work out so doing this instead
export async function GET() {
  try {
    await db.query(`
      DO $$ BEGIN
        CREATE TYPE shade_requirement AS ENUM ('FULL SUN', 'PART SHADE', 'FULL SHADE');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await db.query(`
      DO $$ BEGIN
        CREATE TYPE origin_continent AS ENUM ('AFRICA', 'ASIA', 'EUROPE', 'NORTH AMERICA', 'SOUTH AMERICA', 'OCEANIA');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS plant (
        id                SERIAL PRIMARY KEY,
        price             NUMERIC(10, 2)   NOT NULL,
        name              VARCHAR(255)     NOT NULL,
        origin_continent  origin_continent,
        max_height_cm     INT,
        max_width_cm      INT,
        shade_requirement shade_requirement
      )
    `);

    await db.query(`
      INSERT INTO plant (name, price, origin_continent, max_height_cm, max_width_cm, shade_requirement)
      VALUES
        ('Waratah', 12.99, 'OCEANIA', 180, 150, 'FULL SUN'),
        ('Kangaroo Paw', 8.99, 'OCEANIA', 150, 100, 'FULL SUN'),
        ('Dwarf Bottlebrush', 14.99, 'OCEANIA', 150, 120, 'FULL SUN'),
        ('Flannel Flower', 9.99, 'OCEANIA', 60, 60, 'FULL SUN'),
        ('Blue Flax Lily', 7.99, 'OCEANIA', 100, 80, 'PART SHADE'),
        ('Native Violet', 5.99, 'OCEANIA', 15, 50, 'PART SHADE'),
        ('Common Correa', 11.99, 'OCEANIA', 150, 150, 'PART SHADE'),
        ('Running Postman', 8.99, 'OCEANIA', 30, 100, 'FULL SUN'),
        ('Happy Wanderer', 12.99, 'OCEANIA', 200, 150, 'FULL SUN'),
        ('Fan Flower', 7.99, 'OCEANIA', 50, 100, 'FULL SUN'),
        ('Tasman Flax Lily', 8.99, 'OCEANIA', 120, 80, 'PART SHADE'),
        ('Coast Rosemary', 13.99, 'OCEANIA', 200, 200, 'FULL SUN'),
        ('Long-leaf Waxflower', 11.99, 'OCEANIA', 150, 120, 'FULL SUN'),
        ('Rock Isotome', 6.99, 'OCEANIA', 40, 40, 'FULL SUN'),
        ('Rock Purslane', 7.99, 'OCEANIA', 60, 80, 'FULL SUN'),
        ('Hop Goodenia', 9.99, 'OCEANIA', 100, 150, 'PART SHADE'),
        ('Creeping Boobialla', 8.99, 'OCEANIA', 30, 200, 'FULL SUN'),
        ('Oval-leaf Mint Bush', 13.99, 'OCEANIA', 200, 150, 'PART SHADE'),
        ('Cut-leaf Daisy', 6.99, 'OCEANIA', 30, 60, 'FULL SUN'),
        ('Large-fruit Thomasia', 10.99, 'OCEANIA', 100, 100, 'PART SHADE'),
        ('Red Lechenaultia', 9.99, 'OCEANIA', 40, 60, 'FULL SUN'),
        ('Pink Rice Flower', 11.99, 'OCEANIA', 100, 100, 'FULL SUN'),
        ('Small Crowea', 10.99, 'OCEANIA', 100, 100, 'PART SHADE'),
        ('Dog Rose', 12.99, 'OCEANIA', 100, 100, 'PART SHADE'),
        ('One-sided Bottlebrush', 13.99, 'OCEANIA', 200, 150, 'FULL SUN'),
        ('Robyn Gordon Grevillea', 14.99, 'OCEANIA', 150, 200, 'FULL SUN'),
        ('Silver Spurflower', 9.99, 'OCEANIA', 100, 120, 'PART SHADE'),
        ('Spiny-headed Mat-rush', 8.99, 'OCEANIA', 100, 100, 'FULL SUN'),
        ('Karkalla', 7.99, 'OCEANIA', 20, 200, 'FULL SUN'),
        ('Kidney Weed', 5.99, 'OCEANIA', 5, 100, 'PART SHADE'),
        ('Dampiera', 7.99, 'OCEANIA', 30, 100, 'FULL SUN'),
        ('Snake Vine', 14.99, 'OCEANIA', 200, 150, 'FULL SUN'),
        ('Purple Coral Pea', 12.99, 'OCEANIA', 200, 150, 'FULL SUN'),
        ('Native Daisy', 6.99, 'OCEANIA', 40, 40, 'FULL SUN'),
        ('Mat Rush', 7.99, 'OCEANIA', 60, 60, 'FULL SUN'),
        ('Swan River Daisy', 6.99, 'OCEANIA', 30, 50, 'FULL SUN'),
        ('Billy Buttons', 8.99, 'OCEANIA', 60, 30, 'FULL SUN'),
        ('Everlasting Daisy', 9.99, 'OCEANIA', 90, 60, 'FULL SUN'),
        ('Dwarf Lilly Pilly', 18.99, 'OCEANIA', 150, 100, 'PART SHADE'),
        ('Coastal Daisy Bush', 12.99, 'OCEANIA', 150, 150, 'FULL SUN'),
        ('Native Groundsel', 7.99, 'OCEANIA', 60, 60, 'FULL SUN'),
        ('Native Tussock Grass', 9.99, 'OCEANIA', 100, 80, 'FULL SUN'),
        ('Trigger Plant', 7.99, 'OCEANIA', 60, 30, 'FULL SUN'),
        ('Native Iris', 8.99, 'OCEANIA', 60, 40, 'PART SHADE'),
        ('Golden Guinea Flower', 7.99, 'OCEANIA', 30, 60, 'FULL SUN'),
        ('Nodding Saltbush', 7.99, 'OCEANIA', 50, 100, 'FULL SUN'),
        ('Philotheca', 11.99, 'OCEANIA', 150, 120, 'FULL SUN'),
        ('Blue Dampiera', 8.99, 'OCEANIA', 40, 80, 'FULL SUN'),
        ('Native Cranberry', 10.99, 'OCEANIA', 100, 120, 'PART SHADE'),
        ('Lemon Beautyheads', 7.99, 'OCEANIA', 60, 80, 'FULL SUN'),
        ('Rose', 14.99, 'EUROPE', 200, 150, 'FULL SUN'),
        ('Lavender', 9.99, 'EUROPE', 90, 90, 'FULL SUN'),
        ('Dwarf Sunflower', 4.99, 'NORTH AMERICA', 60, 30, 'FULL SUN'),
        ('Hydrangea', 19.99, 'ASIA', 200, 200, 'PART SHADE'),
        ('Bird of Paradise', 24.99, 'AFRICA', 150, 120, 'FULL SUN'),
        ('Tulip', 6.99, 'ASIA', 70, 20, 'FULL SUN'),
        ('Dwarf Bougainvillea', 18.99, 'SOUTH AMERICA', 200, 150, 'FULL SUN'),
        ('Common Jasmine', 12.99, 'ASIA', 200, 150, 'FULL SUN'),
        ('Japanese Camellia', 29.99, 'ASIA', 200, 150, 'PART SHADE'),
        ('Dwarf Rhododendron', 34.99, 'ASIA', 150, 150, 'PART SHADE'),
        ('African Lily', 12.99, 'AFRICA', 100, 60, 'FULL SUN'),
        ('Aloe Vera', 8.99, 'AFRICA', 60, 60, 'FULL SUN'),
        ('Moth Orchid', 24.99, 'ASIA', 60, 30, 'PART SHADE'),
        ('King Protea', 29.99, 'AFRICA', 200, 200, 'FULL SUN'),
        ('Chinese Peony', 17.99, 'ASIA', 90, 90, 'FULL SUN'),
        ('Dahlia', 9.99, 'NORTH AMERICA', 120, 60, 'FULL SUN'),
        ('Chinese Hibiscus', 16.99, 'ASIA', 200, 150, 'FULL SUN'),
        ('Blue Passion Flower', 16.99, 'SOUTH AMERICA', 200, 100, 'FULL SUN'),
        ('Boston Fern', 12.99, 'NORTH AMERICA', 90, 90, 'FULL SHADE'),
        ('Peace Lily', 14.99, 'SOUTH AMERICA', 60, 60, 'FULL SHADE'),
        ('Monstera', 19.99, 'SOUTH AMERICA', 200, 150, 'PART SHADE'),
        ('Calla Lily', 13.99, 'AFRICA', 90, 60, 'PART SHADE'),
        ('Snapdragon', 5.99, 'EUROPE', 90, 30, 'FULL SUN'),
        ('Foxglove', 7.99, 'EUROPE', 150, 60, 'PART SHADE'),
        ('Bearded Iris', 11.99, 'EUROPE', 90, 45, 'FULL SUN'),
        ('Daffodil', 6.99, 'EUROPE', 50, 15, 'FULL SUN'),
        ('Bleeding Heart', 14.99, 'ASIA', 90, 60, 'PART SHADE'),
        ('Ginger', 12.99, 'ASIA', 100, 60, 'PART SHADE'),
        ('Dwarf Heliconia', 22.99, 'SOUTH AMERICA', 150, 100, 'PART SHADE'),
        ('Tropical Pitcher Plant', 34.99, 'ASIA', 100, 60, 'PART SHADE'),
        ('Century Plant', 24.99, 'NORTH AMERICA', 200, 200, 'FULL SUN'),
        ('Canna Lily', 11.99, 'SOUTH AMERICA', 200, 100, 'FULL SUN'),
        ('Busy Lizzie', 5.99, 'AFRICA', 60, 60, 'PART SHADE'),
        ('Rex Begonia', 12.99, 'ASIA', 45, 45, 'PART SHADE'),
        ('Zinnia', 4.99, 'NORTH AMERICA', 90, 30, 'FULL SUN'),
        ('Chrysanthemum', 9.99, 'ASIA', 90, 60, 'FULL SUN'),
        ('Pansy', 4.99, 'EUROPE', 25, 25, 'PART SHADE'),
        ('African Violet', 9.99, 'AFRICA', 15, 20, 'PART SHADE'),
        ('Salvia', 8.99, 'SOUTH AMERICA', 90, 45, 'FULL SUN'),
        ('Petunia', 4.99, 'SOUTH AMERICA', 30, 60, 'FULL SUN'),
        ('Marigold', 4.99, 'NORTH AMERICA', 60, 30, 'FULL SUN'),
        ('Geranium', 7.99, 'AFRICA', 60, 45, 'FULL SUN'),
        ('Fuchsia', 9.99, 'SOUTH AMERICA', 90, 60, 'PART SHADE'),
        ('Azalea', 19.99, 'ASIA', 150, 150, 'PART SHADE'),
        ('Gardenia', 19.99, 'ASIA', 150, 150, 'PART SHADE'),
        ('Heather', 8.99, 'EUROPE', 60, 60, 'FULL SUN'),
        ('Primrose', 5.99, 'EUROPE', 20, 20, 'PART SHADE'),
        ('Verbena', 6.99, 'SOUTH AMERICA', 50, 60, 'FULL SUN'),
        ('New Guinea Impatiens', 7.99, 'ASIA', 60, 45, 'PART SHADE'),
        ('Lobelia', 4.99, 'AFRICA', 20, 20, 'PART SHADE')
      ON CONFLICT DO NOTHING
    `);

    return Response.json({ message: "Plant table created and seeded successfully" });
  } catch (error) {
    return Response.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
