import postgres from 'postgres';

// Original plan was to use Bunnings' api. Did not work out so doing this instead

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function GET() {
  try {
    await sql`DROP TABLE IF EXISTS generation_log`;
    await sql`DROP TABLE IF EXISTS plant`;
    await sql`DROP TYPE IF EXISTS shade_requirement`;
    await sql`DROP TYPE IF EXISTS origin_continent`;

    await sql`CREATE TABLE generation_log (
      id         SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

    await sql`CREATE TYPE shade_requirement AS ENUM ('Full Sun', 'Part Shade', 'Full Shade')`;
    await sql`CREATE TYPE origin_continent AS ENUM ('Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania')`;

    await sql`
      CREATE TABLE plant (
        id                SERIAL PRIMARY KEY,
        price             NUMERIC(10, 2)   NOT NULL,
        name              VARCHAR(255)     NOT NULL,
        origin_continent  origin_continent,
        max_height_cm     INT,
        max_width_cm      INT,
        shade_requirement shade_requirement
      )
    `;

    await sql`
      INSERT INTO plant (name, price, origin_continent, max_height_cm, max_width_cm, shade_requirement)
      VALUES
        ('Waratah', 12.99, 'Oceania', 180, 150, 'Full Sun'),
        ('Kangaroo Paw', 8.99, 'Oceania', 150, 100, 'Full Sun'),
        ('Dwarf Bottlebrush', 14.99, 'Oceania', 150, 120, 'Full Sun'),
        ('Flannel Flower', 9.99, 'Oceania', 60, 60, 'Full Sun'),
        ('Blue Flax Lily', 7.99, 'Oceania', 100, 80, 'Part Shade'),
        ('Native Violet', 5.99, 'Oceania', 15, 50, 'Part Shade'),
        ('Common Correa', 11.99, 'Oceania', 150, 150, 'Part Shade'),
        ('Running Postman', 8.99, 'Oceania', 30, 100, 'Full Sun'),
        ('Happy Wanderer', 12.99, 'Oceania', 200, 150, 'Full Sun'),
        ('Fan Flower', 7.99, 'Oceania', 50, 100, 'Full Sun'),
        ('Tasman Flax Lily', 8.99, 'Oceania', 120, 80, 'Part Shade'),
        ('Coast Rosemary', 13.99, 'Oceania', 200, 200, 'Full Sun'),
        ('Long-leaf Waxflower', 11.99, 'Oceania', 150, 120, 'Full Sun'),
        ('Rock Isotome', 6.99, 'Oceania', 40, 40, 'Full Sun'),
        ('Rock Purslane', 7.99, 'Oceania', 60, 80, 'Full Sun'),
        ('Hop Goodenia', 9.99, 'Oceania', 100, 150, 'Part Shade'),
        ('Creeping Boobialla', 8.99, 'Oceania', 30, 200, 'Full Sun'),
        ('Oval-leaf Mint Bush', 13.99, 'Oceania', 200, 150, 'Part Shade'),
        ('Cut-leaf Daisy', 6.99, 'Oceania', 30, 60, 'Full Sun'),
        ('Large-fruit Thomasia', 10.99, 'Oceania', 100, 100, 'Part Shade'),
        ('Red Lechenaultia', 9.99, 'Oceania', 40, 60, 'Full Sun'),
        ('Pink Rice Flower', 11.99, 'Oceania', 100, 100, 'Full Sun'),
        ('Small Crowea', 10.99, 'Oceania', 100, 100, 'Part Shade'),
        ('Dog Rose', 12.99, 'Oceania', 100, 100, 'Part Shade'),
        ('One-sided Bottlebrush', 13.99, 'Oceania', 200, 150, 'Full Sun'),
        ('Robyn Gordon Grevillea', 14.99, 'Oceania', 150, 200, 'Full Sun'),
        ('Silver Spurflower', 9.99, 'Oceania', 100, 120, 'Part Shade'),
        ('Spiny-headed Mat-rush', 8.99, 'Oceania', 100, 100, 'Full Sun'),
        ('Karkalla', 7.99, 'Oceania', 20, 200, 'Full Sun'),
        ('Kidney Weed', 5.99, 'Oceania', 5, 100, 'Part Shade'),
        ('Dampiera', 7.99, 'Oceania', 30, 100, 'Full Sun'),
        ('Snake Vine', 14.99, 'Oceania', 200, 150, 'Full Sun'),
        ('Purple Coral Pea', 12.99, 'Oceania', 200, 150, 'Full Sun'),
        ('Native Daisy', 6.99, 'Oceania', 40, 40, 'Full Sun'),
        ('Mat Rush', 7.99, 'Oceania', 60, 60, 'Full Sun'),
        ('Swan River Daisy', 6.99, 'Oceania', 30, 50, 'Full Sun'),
        ('Billy Buttons', 8.99, 'Oceania', 60, 30, 'Full Sun'),
        ('Everlasting Daisy', 9.99, 'Oceania', 90, 60, 'Full Sun'),
        ('Dwarf Lilly Pilly', 18.99, 'Oceania', 150, 100, 'Part Shade'),
        ('Coastal Daisy Bush', 12.99, 'Oceania', 150, 150, 'Full Sun'),
        ('Native Groundsel', 7.99, 'Oceania', 60, 60, 'Full Sun'),
        ('Native Tussock Grass', 9.99, 'Oceania', 100, 80, 'Full Sun'),
        ('Trigger Plant', 7.99, 'Oceania', 60, 30, 'Full Sun'),
        ('Native Iris', 8.99, 'Oceania', 60, 40, 'Part Shade'),
        ('Golden Guinea Flower', 7.99, 'Oceania', 30, 60, 'Full Sun'),
        ('Nodding Saltbush', 7.99, 'Oceania', 50, 100, 'Full Sun'),
        ('Philotheca', 11.99, 'Oceania', 150, 120, 'Full Sun'),
        ('Blue Dampiera', 8.99, 'Oceania', 40, 80, 'Full Sun'),
        ('Native Cranberry', 10.99, 'Oceania', 100, 120, 'Part Shade'),
        ('Lemon Beautyheads', 7.99, 'Oceania', 60, 80, 'Full Sun'),
        ('Rose', 14.99, 'Europe', 200, 150, 'Full Sun'),
        ('Lavender', 9.99, 'Europe', 90, 90, 'Full Sun'),
        ('Dwarf Sunflower', 4.99, 'North America', 60, 30, 'Full Sun'),
        ('Hydrangea', 19.99, 'Asia', 200, 200, 'Part Shade'),
        ('Bird of Paradise', 24.99, 'Africa', 150, 120, 'Full Sun'),
        ('Tulip', 6.99, 'Asia', 70, 20, 'Full Sun'),
        ('Dwarf Bougainvillea', 18.99, 'South America', 200, 150, 'Full Sun'),
        ('Common Jasmine', 12.99, 'Asia', 200, 150, 'Full Sun'),
        ('Japanese Camellia', 29.99, 'Asia', 200, 150, 'Part Shade'),
        ('Dwarf Rhododendron', 34.99, 'Asia', 150, 150, 'Part Shade'),
        ('African Lily', 12.99, 'Africa', 100, 60, 'Full Sun'),
        ('Aloe Vera', 8.99, 'Africa', 60, 60, 'Full Sun'),
        ('Moth Orchid', 24.99, 'Asia', 60, 30, 'Part Shade'),
        ('King Protea', 29.99, 'Africa', 200, 200, 'Full Sun'),
        ('Chinese Peony', 17.99, 'Asia', 90, 90, 'Full Sun'),
        ('Dahlia', 9.99, 'North America', 120, 60, 'Full Sun'),
        ('Chinese Hibiscus', 16.99, 'Asia', 200, 150, 'Full Sun'),
        ('Blue Passion Flower', 16.99, 'South America', 200, 100, 'Full Sun'),
        ('Boston Fern', 12.99, 'North America', 90, 90, 'Full Shade'),
        ('Peace Lily', 14.99, 'South America', 60, 60, 'Full Shade'),
        ('Monstera', 19.99, 'South America', 200, 150, 'Part Shade'),
        ('Calla Lily', 13.99, 'Africa', 90, 60, 'Part Shade'),
        ('Snapdragon', 5.99, 'Europe', 90, 30, 'Full Sun'),
        ('Foxglove', 7.99, 'Europe', 150, 60, 'Part Shade'),
        ('Bearded Iris', 11.99, 'Europe', 90, 45, 'Full Sun'),
        ('Daffodil', 6.99, 'Europe', 50, 15, 'Full Sun'),
        ('Bleeding Heart', 14.99, 'Asia', 90, 60, 'Part Shade'),
        ('Ginger', 12.99, 'Asia', 100, 60, 'Part Shade'),
        ('Dwarf Heliconia', 22.99, 'South America', 150, 100, 'Part Shade'),
        ('Tropical Pitcher Plant', 34.99, 'Asia', 100, 60, 'Part Shade'),
        ('Century Plant', 24.99, 'North America', 200, 200, 'Full Sun'),
        ('Canna Lily', 11.99, 'South America', 200, 100, 'Full Sun'),
        ('Busy Lizzie', 5.99, 'Africa', 60, 60, 'Part Shade'),
        ('Rex Begonia', 12.99, 'Asia', 45, 45, 'Part Shade'),
        ('Zinnia', 4.99, 'North America', 90, 30, 'Full Sun'),
        ('Chrysanthemum', 9.99, 'Asia', 90, 60, 'Full Sun'),
        ('Pansy', 4.99, 'Europe', 25, 25, 'Part Shade'),
        ('African Violet', 9.99, 'Africa', 15, 20, 'Part Shade'),
        ('Salvia', 8.99, 'South America', 90, 45, 'Full Sun'),
        ('Petunia', 4.99, 'South America', 30, 60, 'Full Sun'),
        ('Marigold', 4.99, 'North America', 60, 30, 'Full Sun'),
        ('Geranium', 7.99, 'Africa', 60, 45, 'Full Sun'),
        ('Fuchsia', 9.99, 'South America', 90, 60, 'Part Shade'),
        ('Azalea', 19.99, 'Asia', 150, 150, 'Part Shade'),
        ('Gardenia', 19.99, 'Asia', 150, 150, 'Part Shade'),
        ('Heather', 8.99, 'Europe', 60, 60, 'Full Sun'),
        ('Primrose', 5.99, 'Europe', 20, 20, 'Part Shade'),
        ('Verbena', 6.99, 'South America', 50, 60, 'Full Sun'),
        ('New Guinea Impatiens', 7.99, 'Asia', 60, 45, 'Part Shade'),
        ('Lobelia', 4.99, 'Africa', 20, 20, 'Part Shade')
    `;

    return Response.json({ message: "Plant table created and seeded successfully" });
  } catch (error) {
    return Response.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
