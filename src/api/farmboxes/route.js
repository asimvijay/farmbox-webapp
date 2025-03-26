import { Pool } from '@neondatabase/serverless';

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const { rows: farmboxes } = await pool.query(`
      SELECT 
        fb.id,
        fb.title,
        fb.price,
        fb.description,
        fb.image,
        (
          SELECT json_agg(
            json_build_object(
              'name', i.name,
              'image', i.image
            )
          )
          FROM items i
          WHERE i.farmbox_id = fb.id
        ) as items
      FROM farmboxes fb
    `);

    return new Response(JSON.stringify(farmboxes), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await pool.end();
  }
}