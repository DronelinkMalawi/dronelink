import { supabase } from '@/lib/supabase';

const SupabaseTest = () => {
  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase.from('portfolio_items').select('count').limit(1);
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is OK
        throw error;
      }
      alert('✅ Supabase connection successful!');
    } catch (error: any) {
      console.error('Supabase connection error:', error);
      alert(`❌ Supabase connection failed: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-4">Supabase Connection Test</h2>
      <button
        onClick={testConnection}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Test Connection
      </button>
      <div className="mt-4 text-sm text-gray-400">
        <p>Current Supabase URL: {import.meta.env.VITE_SUPABASE_URL}</p>
        <p>Current Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
      </div>
    </div>
  );
};

export default SupabaseTest;