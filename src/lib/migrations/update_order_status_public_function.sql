-- Create a function to update order status that bypasses RLS
-- This function is designed to be called by authenticated users with appropriate permissions
CREATE OR REPLACE FUNCTION update_order_status_public(p_order_id INTEGER, p_status TEXT)
RETURNS BOOLEAN
SECURITY DEFINER -- This means the function runs with the privileges of the user who created it
AS $$
DECLARE
  updated_rows INTEGER;
BEGIN
  -- Make sure the status value is valid
  IF p_status NOT IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status value: %', p_status;
  END IF;

  -- Perform the update
  UPDATE orders
  SET 
    status = p_status
  WHERE id = p_order_id;
  
  -- Check if any rows were updated
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  
  -- Return true if at least one row was updated
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_order_status_public(INTEGER, TEXT) TO authenticated;

-- Example usage:
-- SELECT update_order_status_public(1, 'shipped'); 