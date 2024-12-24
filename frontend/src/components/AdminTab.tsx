import React, { useState } from 'react';
import { addProject, getAllProjects } from '../api/projectsApi';
import { TextField, Button, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import MessagePopup from './MessagePopup';
import { Project } from '../types/project.types';

const AdminTab: React.FC = () => {
  const [project, setProject] = useState<Project>({
    name: '',
    country: '',
    image: '',
    pricePerTon: 0,
    offeredVolume: 0,
    distributionWeight: 0,
    supplierName: '',
    earliestDelivery: '',
    description: '',
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isAddingProject, setIsAddingProject] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleChange = (field: keyof Project, value: string | number) => {
    setProject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const showMessage = (message: string, type: 'success' | 'error') => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleAddProject = async () => {
    try {
      const result = await addProject(project);
      if (result.id) {
        showMessage('Project added successfully!', 'success');
        setProject({
          name: '',
          country: '',
          image: '',
          pricePerTon: 0,
          offeredVolume: 0,
          distributionWeight: 0,
          supplierName: '',
          earliestDelivery: '',
          description: '',
        });
        setIsAddingProject(false);
      } else {
        showMessage('Failed to add project.', 'error');
      }
    } catch (error) {
      showMessage('Error adding project.', 'error');
      console.log(error);
    }
  };

  const handleFetchProjects = async () => {
    try {
      const fetchedProjects = await getAllProjects();
      setProjects(fetchedProjects);
      showMessage('Projects fetched successfully!', 'success');
    } catch (error) {
      showMessage('Error fetching projects.', 'error');
      console.log(error);
    }
  };

  const filteredProjects = projects.filter((proj) =>
    Object.values(proj)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" mb={2}>
        Admin Panel
      </Typography>
      <Button
        variant="contained"
        onClick={() => setIsAddingProject((prev) => !prev)}
        sx={{ mb: 2 }}
      >
        {isAddingProject ? 'Cancel' : 'Add Project'}
      </Button>
      {isAddingProject && (
        <>
          <Typography variant="h6" mb={2}>
            Add New Project
          </Typography>
          <TextField
            label="Project Name"
            fullWidth
            value={project.name}
            onChange={(e) => handleChange('name', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Country"
            fullWidth
            value={project.country}
            onChange={(e) => handleChange('country', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL"
            fullWidth
            value={project.image}
            onChange={(e) => handleChange('image', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price Per Ton"
            fullWidth
            type="number"
            value={project.pricePerTon}
            onChange={(e) => handleChange('pricePerTon', Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Offered Volume (Tons)"
            fullWidth
            type="number"
            value={project.offeredVolume}
            onChange={(e) => handleChange('offeredVolume', Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Distribution Weight"
            fullWidth
            type="number"
            value={project.distributionWeight}
            onChange={(e) => handleChange('distributionWeight', Number(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Supplier Name"
            fullWidth
            value={project.supplierName}
            onChange={(e) => handleChange('supplierName', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Earliest Delivery Date"
            fullWidth
            type="date"
            value={project.earliestDelivery}
            onChange={(e) => handleChange('earliestDelivery', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={project.description}
            onChange={(e) => handleChange('description', e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" sx={{ mr: 2 }} onClick={handleAddProject}>
            Add Project
          </Button>
        </>
      )}
      <Button variant="outlined" onClick={handleFetchProjects} sx={{ mb: 2 }}>
        Fetch Projects
      </Button>
      <TextField
        label="Search Projects"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Typography variant="h6" mt={4}>
        Project List
      </Typography>
      {filteredProjects.length > 0 ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Price Per Ton</TableCell>
              <TableCell>Offered Volume</TableCell>
              <TableCell>Distribution Weight</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Earliest Delivery</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.map((proj) => (
              <TableRow key={proj.id}>
                <TableCell>{proj.id}</TableCell>
                <TableCell>{proj.name}</TableCell>
                <TableCell>{proj.country}</TableCell>
                <TableCell>{proj.pricePerTon}</TableCell>
                <TableCell>{proj.offeredVolume}</TableCell>
                <TableCell>{proj.distributionWeight}</TableCell>
                <TableCell>{proj.supplierName}</TableCell>
                <TableCell>{proj.earliestDelivery}</TableCell>
                <TableCell>{proj.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>No projects found.</Typography>
      )}
      {popup && <MessagePopup message={popup.message} type={popup.type} onClose={() => setPopup(null)} />}
    </Box>
  );
};

export default AdminTab;
