"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProjectCard } from "~~/components/shared/ProjectCard";
import { mockProjects } from "~~/data/mockData";

type ProjectFilter = "all" | "funding" | "tasks";
type ProjectStatus = "all" | "active" | "completed";

const ProjectsContent = () => {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<ProjectFilter>((searchParams.get("filter") as ProjectFilter) || "all");
  const [status, setStatus] = useState<ProjectStatus>((searchParams.get("status") as ProjectStatus) || "all");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  const filteredProjects = mockProjects.filter(project => {
    // Filter by type (funding/tasks)
    if (filter === "funding" && project.raisedAmount >= project.fundingGoal) return false;
    if (filter === "tasks" && project.tasks.every(task => task.status === "completed")) return false;

    // Filter by status
    if (status === "completed") {
      if (project.status !== "completed") return false;
    } else if (status === "active") {
      if (project.status !== "active") return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.title.toLowerCase().includes(searchLower) || project.description.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="flex flex-col pt-24 min-h-screen animate-fade-in">
      {/* SVG Background */}
      <div className="fixed inset-0 z-[-1] opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M0,0 L40,0 L40,40 L0,40 L0,0 Z M39,1 L1,1 L1,39 L39,39 L39,1 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
            </pattern>
            <mask id="gridMask">
              <rect width="100%" height="100%" fill="url(#grid)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          <rect width="100%" height="100%" fill="currentColor" mask="url(#gridMask)" opacity="0.2" />
        </svg>
      </div>

      {/* Header Section */}
      <div className="w-full bg-gradient-to-b to-transparent from-base-200/50">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:py-12">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl"></div>
            <div className="absolute top-1/2 -translate-y-1/2 right-24 w-72 h-72 rounded-full bg-gradient-to-tr from-accent/30 to-primary/30 blur-xl animate-pulse"></div>
            
            <h1 className="mb-4 text-3xl font-bold sm:mb-6 sm:text-5xl animate-slide-up relative z-10">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-extrabold">Idea Pulse</span> 
              <span className="block sm:inline"> Ecosystem</span>
            </h1>
            
            <div className="relative mb-8 max-w-3xl">
              <p className="text-base sm:text-xl leading-relaxed opacity-90 delay-100 animate-slide-up">
                <span className="font-semibold">Where AI and community unite</span> to transform innovative ideas into 
                <span className="relative inline-block mx-1">
                  <span className="relative z-10">Web3 realities</span>
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-accent/30 -rotate-1"></span>
                </span> 
                through transparent funding and collaborative development.
                <span className="block mt-2">
                  Powered by intelligent <span className="text-secondary font-medium">AI Agents</span> that help curate ideas, 
                  generate structured proposals, and facilitate community-driven governance for a truly decentralized innovation ecosystem.
                </span>
                <span className="block mt-2 text-sm sm:text-base italic opacity-80">
                  Breaking traditional VC monopolies through community-powered token economics and AI-assisted project development — where every contributor is rewarded fairly based on their value creation.
                </span>
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 mb-2 delay-200 sm:gap-8 sm:mb-4 sm:flex-row animate-slide-up">
            {/* Filter Group */}
            <div className="overflow-x-auto flex-nowrap rounded-lg shadow-md join bg-base-100">
              <button
                className={`btn join-item btn-sm sm:btn-md ${filter === "all" ? "btn-primary" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Projects
              </button>
              <button
                className={`btn join-item btn-sm sm:btn-md ${filter === "funding" ? "btn-primary" : ""}`}
                onClick={() => setFilter("funding")}
              >
                Funding Open
              </button>
              <button
                className={`btn join-item btn-sm sm:btn-md ${filter === "tasks" ? "btn-primary" : ""}`}
                onClick={() => setFilter("tasks")}
              >
                Tasks Available
              </button>
            </div>

            {/* Status Group */}
            <div className="overflow-x-auto flex-nowrap rounded-lg shadow-md join bg-base-100">
              <button
                className={`btn join-item btn-sm sm:btn-md ${status === "all" ? "btn-secondary" : ""}`}
                onClick={() => setStatus("all")}
              >
                All Status
              </button>
              <button
                className={`btn join-item btn-sm sm:btn-md ${status === "active" ? "btn-secondary" : ""}`}
                onClick={() => setStatus("active")}
              >
                Active
              </button>
              <button
                className={`btn join-item btn-sm sm:btn-md ${status === "completed" ? "btn-secondary" : ""}`}
                onClick={() => setStatus("completed")}
              >
                Completed
              </button>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full shadow-md input input-sm sm:input-md input-bordered bg-base-100 sm:max-w-xs"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-4 pt-0 pb-8 mx-auto max-w-7xl sm:pb-12">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className={`animate-scale-up delay-${(index % 3) * 100}`}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-12 text-center shadow-lg sm:py-16 card bg-base-100">
            <p className="text-lg opacity-60">No projects found matching your criteria.</p>
            <button
              className="mx-auto mt-4 btn btn-primary btn-sm"
              onClick={() => {
                setFilter("all");
                setStatus("all");
                setSearchTerm("");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading projects...</div>}>
      <ProjectsContent />
    </Suspense>
  );
};

export default ProjectsPage;
