import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuthDiagnostic = () => {
  const [results, setResults] = useState<Array<{ test: string; status: 'pass' | 'fail' | 'info'; message: string }>>([]);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const newResults: Array<{ test: string; status: 'pass' | 'fail' | 'info'; message: string }> = [];

    // Test 1: Supabase URL
    newResults.push({
      test: 'Supabase URL',
      status: import.meta.env.VITE_SUPABASE_URL ? 'pass' : 'fail',
      message: import.meta.env.VITE_SUPABASE_URL || 'Missing URL'
    });

    // Test 2: Supabase Anon Key
    newResults.push({
      test: 'Supabase Anon Key',
      status: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'pass' : 'fail',
      message: import.meta.env.VITE_SUPABASE_ANON_KEY ? `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'Missing Key'
    });

    // Test 3: Connection
    try {
      const { data, error } = await supabase.from('portfolio_items').select('count').limit(1);
      if (error && error.code !== 'PGRST116') {
        newResults.push({
          test: 'Database Connection',
          status: 'fail',
          message: error.message
        });
      } else {
        newResults.push({
          test: 'Database Connection',
          status: 'pass',
          message: 'Connected to portfolio_items table'
        });
      }
    } catch (error) {
      newResults.push({
        test: 'Database Connection',
        status: 'fail',
        message: error instanceof Error ? error.message : 'Connection failed'
      });
    }

    // Test 4: Auth Session
    try {
      const { data: { session } } = await supabase.auth.getSession();
      newResults.push({
        test: 'Auth Session',
        status: session ? 'pass' : 'info',
        message: session ? `Logged in as: ${session.user?.email}` : 'No active session (not logged in)'
      });
    } catch (error) {
      newResults.push({
        test: 'Auth Session',
        status: 'fail',
        message: error instanceof Error ? error.message : 'Session check failed'
      });
    }

    // Test 5: Auth Settings
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        newResults.push({
          test: 'Auth User Validation',
          status: 'info',
          message: error.message
        });
      } else {
        newResults.push({
          test: 'Auth User Validation',
          status: data.user ? 'pass' : 'info',
          message: data.user ? `Valid user: ${data.user.email}` : 'No user found'
        });
      }
    } catch (error) {
      newResults.push({
        test: 'Auth User Validation',
        status: 'fail',
        message: error instanceof Error ? error.message : 'User validation failed'
      });
    }

    setResults(newResults);
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Auth Diagnostic Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runDiagnostics} 
              disabled={testing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {testing ? 'Running Diagnostics...' : 'Run Diagnostics'}
            </Button>

            {results.length > 0 && (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    result.status === 'pass' 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : result.status === 'fail'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-yellow-500/10 border-yellow-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{result.test}</span>
                      <span className={`text-xs font-bold uppercase ${
                        result.status === 'pass' 
                          ? 'text-green-400' 
                          : result.status === 'fail'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{result.message}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
              <h3 className="text-white font-medium mb-2">How to fix login issues:</h3>
              <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Supabase Dashboard</a></li>
                <li>Open your project: <code className="text-cyan-400">unesicenmbspwhjvlqws</code></li>
                <li>Go to <strong>Authentication → Users</strong></li>
                <li>Click <strong>Add user</strong> and create an admin account</li>
                <li>Make sure <strong>Auto-confirm user</strong> is enabled</li>
                <li>Go to <strong>Authentication → Settings</strong></li>
                <li>Turn off <strong>Enable email confirmations</strong> (for development)</li>
                <li>Set <strong>Site URL</strong> to <code className="text-cyan-400">http://localhost:8081</code></li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthDiagnostic;