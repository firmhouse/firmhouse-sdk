'use client';

import { Select } from '@firmhouse/ui-components';
import { Project } from '../lib/projects';
import { ChangeEventHandler, useTransition } from 'react';
import { saveProjectTypeCookie } from '../lib/actions/projects';
import { usePathname } from 'next/navigation';

export interface ProjectPickerProps {
  activeProject: Project;
}

export function ProjectPicker({ activeProject }: ProjectPickerProps) {
  const pathName = usePathname();
  const options = [
    {
      value: Project.OrderBased,
      label: 'Smart Order-based',
    },
    {
      value: Project.PlanBased,
      label: 'Product as a Service',
    },
  ];
  const [updating, startProjectChangeTransition] = useTransition();
  const handleProjectChange: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    startProjectChangeTransition(() => {
      saveProjectTypeCookie(event.target.value as Project, pathName);
    });
  };

  return (
    <div className="[&>div]:flex [&>div]:items-center">
      <Select
        defaultValue={activeProject}
        label="Project"
        options={options}
        onChange={handleProjectChange}
        disabled={updating}
      />
    </div>
  );
}
