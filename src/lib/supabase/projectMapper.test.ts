import { describe, expect, it } from 'vitest';
import { mapProjectDetail, mapProjectSummary, type ProjectDetailRow, type ProjectSummaryRow } from './projectMapper';

const baseSummary: ProjectSummaryRow = {
  id: 'project-1',
  slug: 'sample-project',
  title: 'Sample Project',
  summary: null,
  category: null,
  year: 2026,
  cover_image_url: null,
  project_students: [
    {
      display_order: 2,
      students: { id: 'student-2', name: 'Second Student', department: 'Engineering', avatar_url: null },
    },
    {
      display_order: 1,
      students: { id: 'student-1', name: 'First Student', department: 'Computer Engineering', avatar_url: null },
    },
  ],
  project_media: [
    { id: 'media-2', type: 'hero', url: 'https://example.com/second.webp', alt_text: 'Second', caption: null, display_order: 2 },
    { id: 'media-1', type: 'hero', url: 'https://example.com/first.webp', alt_text: 'First', caption: null, display_order: 1 },
  ],
};

describe('projectMapper', () => {
  it('sorts relations and uses the first hero medium as cover fallback', () => {
    const result = mapProjectSummary(baseSummary);

    expect(result.student?.name).toBe('First Student');
    expect(result.coverImageUrl).toBe('https://example.com/first.webp');
    expect(result.category).toBeUndefined();
    expect(result.summary).toBeUndefined();
  });

  it('prefers direct cover and repository fallback while dropping invalid sections', () => {
    const row: ProjectDetailRow = {
      ...baseSummary,
      cover_image_url: 'https://example.com/direct.webp',
      subtitle: null,
      department: null,
      github_url: null,
      repository_url: 'https://github.com/example/project',
      project_technologies: [
        { display_order: 2, technologies: { id: 'tech-2', name: 'Python' } },
        { display_order: 1, technologies: { id: 'tech-1', name: 'NS-3' } },
      ],
      project_sections: [
        {
          id: 'invalid',
          section_key: 'invalid',
          title: 'Invalid',
          section_type: 'metrics',
          content: { metrics: [{ name: 'Missing description' }] },
          display_order: 1,
          is_visible: true,
        },
        {
          id: 'overview',
          section_key: 'overview',
          title: 'Overview',
          section_type: 'text',
          content: { paragraphs: ['Valid paragraph'] },
          display_order: 2,
          is_visible: true,
        },
        {
          id: 'hidden',
          section_key: 'hidden',
          title: 'Hidden',
          section_type: 'text',
          content: { paragraphs: ['Should not render'] },
          display_order: 3,
          is_visible: false,
        },
      ],
    };

    const result = mapProjectDetail(row);

    expect(result.coverImageUrl).toBe('https://example.com/direct.webp');
    expect(result.githubUrl).toBe('https://github.com/example/project');
    expect(result.department).toBe('Computer Engineering');
    expect(result.technologies.map((technology) => technology.name)).toEqual(['NS-3', 'Python']);
    expect(result.sections.map((section) => section.id)).toEqual(['overview']);
  });
});
