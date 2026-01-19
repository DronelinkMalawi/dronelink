import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Eye, FileText, Mail, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AnalyticsSummary {
  total_page_views: number;
  unique_visitors: number;
  portfolio_views: number;
  blog_views: number;
  contact_submissions: number;
  avg_daily_views: number;
  top_pages: Array<{ page_url: string; views: number }>;
  top_referrers: Array<{ referrer: string; views: number }>;
}

interface DailyAnalytics {
  date: string;
  page_views: number;
  unique_visitors: number;
}

const Analytics = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dailyData, setDailyData] = useState<DailyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30'); // days

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      // Fetch analytics summary
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_analytics_summary', {
          start_date: startDate.toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        });

      if (summaryError) throw summaryError;

      // Fetch daily analytics for chart
      const { data: dailyDataResult, error: dailyError } = await supabase
        .rpc('get_daily_analytics', {
          start_date: startDate.toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        });

      if (dailyError) throw dailyError;

      setSummary(summaryData?.[0] || null);
      setDailyData(dailyDataResult || []);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getChangeIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="h-4 w-4 text-green-400" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-red-400" />;
    return null;
  };

  const getChangeColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-400';
    if (current < previous) return 'text-red-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-white">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Monitor your website performance and user engagement</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Eye className="h-8 w-8 text-blue-400" />
                <Badge variant="outline" className="text-xs">
                  {dateRange} days
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-bold text-white">
                {formatNumber(summary.total_page_views)}
              </CardTitle>
              <p className="text-gray-400 text-sm">Total Page Views</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-400">Avg: {formatNumber(summary.avg_daily_views)}/day</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Users className="h-8 w-8 text-green-400" />
                <Badge variant="outline" className="text-xs">
                  {dateRange} days
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-bold text-white">
                {formatNumber(summary.unique_visitors)}
              </CardTitle>
              <p className="text-gray-400 text-sm">Unique Visitors</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FileText className="h-8 w-8 text-purple-400" />
                <Badge variant="outline" className="text-xs">
                  {dateRange} days
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-bold text-white">
                {formatNumber(summary.blog_views)}
              </CardTitle>
              <p className="text-gray-400 text-sm">Blog Views</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Mail className="h-8 w-8 text-orange-400" />
                <Badge variant="outline" className="text-xs">
                  {dateRange} days
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl font-bold text-white">
                {formatNumber(summary.contact_submissions)}
              </CardTitle>
              <p className="text-gray-400 text-sm">Contact Submissions</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Page Views Chart */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Daily Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dailyData.slice(-7).map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-400 h-2 rounded-full"
                        style={{
                          width: `${Math.min((day.page_views / Math.max(...dailyData.map(d => d.page_views))) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-white font-medium">
                      {formatNumber(day.page_views)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary?.top_pages?.slice(0, 5).map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 truncate max-w-xs">
                    {page.page_url}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-400 h-2 rounded-full"
                        style={{
                          width: `${Math.min((page.views / Math.max(...summary.top_pages.map(p => p.views))) * 100, 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-white font-medium">
                      {formatNumber(page.views)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Referrers */}
      {summary?.top_referrers && summary.top_referrers.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Top Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summary.top_referrers.slice(0, 6).map((referrer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-sm text-gray-300 truncate">
                    {referrer.referrer || 'Direct'}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {formatNumber(referrer.views)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;