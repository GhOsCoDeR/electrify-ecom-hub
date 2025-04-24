-- Create a function to update order status
CREATE OR REPLACE FUNCTION update_order_status(order_id INTEGER, new_status TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  UPDATE orders
  SET 
    status = new_status,
    updated_at = NOW()
  WHERE id = order_id;
  
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  -- Return true if at least one row was updated
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT update_order_status(1, 'shipped'); 