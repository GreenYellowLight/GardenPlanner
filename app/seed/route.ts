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
        slug              VARCHAR(255)     NOT NULL UNIQUE,
        origin_continent  origin_continent,
        max_height_cm     INT,
        max_width_cm      INT,
        shade_requirement shade_requirement
      )
    `;

    await sql`
      INSERT INTO plant (name, slug, price, origin_continent, max_height_cm, max_width_cm, shade_requirement)
      VALUES
        ('Waratah', 'waratah', 12.99, 'Oceania', 180, 150, 'Full Sun'),
        ('Kangaroo Paw', 'kangaroo-paw', 8.99, 'Oceania', 150, 100, 'Full Sun'),
        ('Dwarf Bottlebrush', 'dwarf-bottlebrush', 14.99, 'Oceania', 150, 120, 'Full Sun'),
        ('Blue Flax Lily', 'blue-flax-lily', 7.99, 'Oceania', 100, 80, 'Part Shade'),
        ('Native Violet', 'native-violet', 5.99, 'Oceania', 15, 50, 'Part Shade'),
        ('Common Correa', 'common-correa', 11.99, 'Oceania', 150, 150, 'Part Shade'),
        ('Running Postman', 'running-postman', 8.99, 'Oceania', 30, 100, 'Full Sun'),
        ('Happy Wanderer', 'happy-wanderer', 12.99, 'Oceania', 200, 150, 'Full Sun'),
    !!! ('Fan Flower', 'fan-flower', 7.99, 'Oceania', 50, 100, 'Full Sun'),
        ('Tasman Flax Lily', 'tasman-flax-lily', 8.99, 'Oceania', 120, 80, 'Part Shade'),
        ('Coast Rosemary', 'coast-rosemary', 13.99, 'Oceania', 200, 200, 'Full Sun'),
   !!!     ('Long-leaf Waxflower', 'long-leaf-waxflower', 11.99, 'Oceania', 150, 120, 'Full Sun'),
        ('Rock Isotome', 'rock-isotome', 6.99, 'Oceania', 40, 40, 'Full Sun'),
        ('Rock Purslane', 'rock-purslane', 7.99, 'Oceania', 60, 80, 'Full Sun'),
        ('Hop Goodenia', 'hop-goodenia', 9.99, 'Oceania', 100, 150, 'Part Shade'),
        ('Creeping Boobialla', 'creeping-boobialla', 8.99, 'Oceania', 30, 200, 'Full Sun'),
     !!   ('Oval-leaf Mint Bush', 'oval-leaf-mint-bush', 13.99, 'Oceania', 200, 150, 'Part Shade'),
        ('Cut-leaf Daisy', 'cut-leaf-daisy', 6.99, 'Oceania', 30, 60, 'Full Sun'),
        ('Large-fruit Thomasia', 'large-fruit-thomasia', 10.99, 'Oceania', 100, 100, 'Part Shade'),
        ('Red Lechenaultia', 'red-lechenaultia', 9.99, 'Oceania', 40, 60, 'Full Sun'),
        ('Pink Rice Flower', 'pink-rice-flower', 11.99, 'Oceania', 100, 100, 'Full Sun'),
    !!    ('Small Crowea', 'small-crowea', 10.99, 'Oceania', 100, 100, 'Part Shade'),
        ('Dog Rose', 'dog-rose', 12.99, 'Oceania', 100, 100, 'Part Shade'),
        ('One-sided Bottlebrush', 'one-sided-bottlebrush', 13.99, 'Oceania', 200, 150, 'Full Sun'),
        ('Robyn Gordon Grevillea', 'robyn-gordon-grevillea', 14.99, 'Oceania', 150, 200, 'Full Sun'),
        ('Silver Spurflower', 'silver-spurflower', 9.99, 'Oceania', 100, 120, 'Part Shade'),
        ('Spiny-headed Mat-rush', 'spiny-headed-mat-rush', 8.99, 'Oceania', 100, 100, 'Full Sun'),
        ('Karkalla', 'karkalla', 7.99, 'Oceania', 20, 200, 'Full Sun'),
        ('Kidney Weed', 'kidney-weed', 5.99, 'Oceania', 5, 100, 'Part Shade'),
        ('Dampiera', 'dampiera', 7.99, 'Oceania', 30, 100, 'Full Sun'),
        ('Snake Vine', 'snake-vine', 14.99, 'Oceania', 200, 150, 'Full Sun'),
        ('Purple Coral Pea', 'purple-coral-pea', 12.99, 'Oceania', 200, 150, 'Full Sun'),
     !!!   ('Native Daisy', 'native-daisy', 6.99, 'Oceania', 40, 40, 'Full Sun'),
        ('Mat Rush', 'mat-rush', 7.99, 'Oceania', 60, 60, 'Full Sun'),
        ('Swan River Daisy', 'swan-river-daisy', 6.99, 'Oceania', 30, 50, 'Full Sun'),
        ('Billy Buttons', 'billy-buttons', 8.99, 'Oceania', 60, 30, 'Full Sun'),
        ('Everlasting Daisy', 'everlasting-daisy', 9.99, 'Oceania', 90, 60, 'Full Sun'),
        ('Dwarf Lilly Pilly', 'dwarf-lilly-pilly', 18.99, 'Oceania', 150, 100, 'Part Shade'),
        ('Coastal Daisy Bush', 'coastal-daisy-bush', 12.99, 'Oceania', 150, 150, 'Full Sun'),
        ('Native Groundsel', 'native-groundsel', 7.99, 'Oceania', 60, 60, 'Full Sun'),
        ('Native Tussock Grass', 'native-tussock-grass', 9.99, 'Oceania', 100, 80, 'Full Sun'),
        ('Trigger Plant', 'trigger-plant', 7.99, 'Oceania', 60, 30, 'Full Sun'),
        ('Native Iris', 'native-iris', 8.99, 'Oceania', 60, 40, 'Part Shade'),
        ('Golden Guinea Flower', 'golden-guinea-flower', 7.99, 'Oceania', 30, 60, 'Full Sun'),
        ('Nodding Saltbush', 'nodding-saltbush', 7.99, 'Oceania', 50, 100, 'Full Sun'),
        ('Philotheca', 'philotheca', 11.99, 'Oceania', 150, 120, 'Full Sun'),
        ('Blue Dampiera', 'blue-dampiera', 8.99, 'Oceania', 40, 80, 'Full Sun'),
    !!!    ('Native Cranberry', 'native-cranberry', 10.99, 'Oceania', 100, 120, 'Part Shade'),
        ('Lemon Beautyheads', 'lemon-beautyheads', 7.99, 'Oceania', 60, 80, 'Full Sun'),
        ('Rose', 'rose', 14.99, 'Europe', 200, 150, 'Full Sun'),
        ('Lavender', 'lavender', 9.99, 'Europe', 90, 90, 'Full Sun'),
        ('Sunflower', 'sunflower', 4.99, 'North America', 60, 30, 'Full Sun'),
        ('Hydrangea', 'hydrangea', 19.99, 'Asia', 200, 200, 'Part Shade'),
        ('Bird of Paradise', 'bird-of-paradise', 24.99, 'Africa', 150, 120, 'Full Sun'),
        ('Tulip', 'tulip', 6.99, 'Asia', 70, 20, 'Full Sun'),
        ('Dwarf Bougainvillea', 'dwarf-bougainvillea', 18.99, 'South America', 200, 150, 'Full Sun'),
        ('Common Jasmine', 'common-jasmine', 12.99, 'Asia', 200, 150, 'Full Sun'),
        ('Japanese Camellia', 'japanese-camellia', 29.99, 'Asia', 200, 150, 'Part Shade'),
        ('Dwarf Rhododendron', 'dwarf-rhododendron', 34.99, 'Asia', 150, 150, 'Part Shade'),
        ('African Lily', 'african-lily', 12.99, 'Africa', 100, 60, 'Full Sun'),
        ('Aloe Vera', 'aloe-vera', 8.99, 'Africa', 60, 60, 'Full Sun'),
        ('Moth Orchid', 'moth-orchid', 24.99, 'Asia', 60, 30, 'Part Shade'),
        ('King Protea', 'king-protea', 29.99, 'Africa', 200, 200, 'Full Sun'),
        ('Chinese Peony', 'chinese-peony', 17.99, 'Asia', 90, 90, 'Full Sun'),
        ('Dahlia', 'dahlia', 9.99, 'North America', 120, 60, 'Full Sun'),
        ('Chinese Hibiscus', 'chinese-hibiscus', 16.99, 'Asia', 200, 150, 'Full Sun'),
      ||  ('Blue Passion Flower', 'blue-passion-flower', 16.99, 'South America', 200, 100, 'Full Sun'),
        ('Boston Fern', 'boston-fern', 12.99, 'North America', 90, 90, 'Full Shade'),
        ('Peace Lily', 'peace-lily', 14.99, 'South America', 60, 60, 'Full Shade'),
        ('Monstera', 'monstera', 19.99, 'South America', 200, 150, 'Part Shade'),
        ('Calla Lily', 'calla-lily', 13.99, 'Africa', 90, 60, 'Part Shade'),
        ('Snapdragon', 'snapdragon', 5.99, 'Europe', 90, 30, 'Full Sun'),
        ('Foxglove', 'foxglove', 7.99, 'Europe', 150, 60, 'Part Shade'),
        ('Bearded Iris', 'bearded-iris', 11.99, 'Europe', 90, 45, 'Full Sun'),
        ('Daffodil', 'daffodil', 6.99, 'Europe', 50, 15, 'Full Sun'),
        ('Bleeding Heart', 'bleeding-heart', 14.99, 'Asia', 90, 60, 'Part Shade'),
        ('Ginger', 'ginger', 12.99, 'Asia', 100, 60, 'Part Shade'),
        ('Dwarf Heliconia', 'dwarf-heliconia', 22.99, 'South America', 150, 100, 'Part Shade'),
        ('Tropical Pitcher Plant', 'tropical-pitcher-plant', 34.99, 'Asia', 100, 60, 'Part Shade'),
        ('Century Plant', 'century-plant', 24.99, 'North America', 200, 200, 'Full Sun'),
        ('Canna Lily', 'canna-lily', 11.99, 'South America', 200, 100, 'Full Sun'),
        ('Busy Lizzie', 'busy-lizzie', 5.99, 'Africa', 60, 60, 'Part Shade'),
        ('Rex Begonia', 'rex-begonia', 12.99, 'Asia', 45, 45, 'Part Shade'),
        ('Zinnia', 'zinnia', 4.99, 'North America', 90, 30, 'Full Sun'),
        ('Chrysanthemum', 'chrysanthemum', 9.99, 'Asia', 90, 60, 'Full Sun'),
        ('Pansy', 'pansy', 4.99, 'Europe', 25, 25, 'Part Shade'),
        ('African Violet', 'african-violet', 9.99, 'Africa', 15, 20, 'Part Shade'),
        ('Salvia', 'salvia', 8.99, 'South America', 90, 45, 'Full Sun'),
        ('Petunia', 'petunia', 4.99, 'South America', 30, 60, 'Full Sun'),
        ('Marigold', 'marigold', 4.99, 'North America', 60, 30, 'Full Sun'),
        ('Geranium', 'geranium', 7.99, 'Africa', 60, 45, 'Full Sun'),
        ('Fuchsia', 'fuchsia', 9.99, 'South America', 90, 60, 'Part Shade'),
        ('Azalea', 'azalea', 19.99, 'Asia', 150, 150, 'Part Shade'),
        ('Gardenia', 'gardenia', 19.99, 'Asia', 150, 150, 'Part Shade'),
        ('Heather', 'heather', 8.99, 'Europe', 60, 60, 'Full Sun'),
        ('Primrose', 'primrose', 5.99, 'Europe', 20, 20, 'Part Shade'),
        ('Verbena', 'verbena', 6.99, 'South America', 50, 60, 'Full Sun'),
        ('New Guinea Impatiens', 'new-guinea-impatiens', 7.99, 'Asia', 60, 45, 'Part Shade'),
        ('Lobelia', 'lobelia', 4.99, 'Africa', 20, 20, 'Part Shade')
    `;

    return Response.json({ message: "Plant table created and seeded successfully" });
  } catch (error) {
    return Response.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
