import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp } from "lucide-react";

export default function JobFilters({ 
  searchTerm, 
  onSearchChange, 
  locationFilter, 
  onLocationChange,
  typeFilter,
  onTypeChange,
  levelFilter,
  onLevelChange,
  showTrendingOnly,
  onTrendingToggle,
  resultCount
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200">
      <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs, companies, skills..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={locationFilter} onValueChange={onLocationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="san francisco">San Francisco</SelectItem>
            <SelectItem value="new york">New York</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger><SelectValue placeholder="Job Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={onLevelChange}>
          <SelectTrigger><SelectValue placeholder="Experience" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="entry">Entry Level</SelectItem>
            <SelectItem value="senior">Senior</SelectItem>
          </SelectContent>
        </Select>

        <Button variant={showTrendingOnly ? "default" : "outline"} onClick={onTrendingToggle}>
          <TrendingUp className="w-4 h-4" /> Trending
        </Button>
      </div>
      
      <div className="text-sm text-gray-600">Found {resultCount} job{resultCount !== 1 ? 's' : ''}</div>
    </div>
  );
}