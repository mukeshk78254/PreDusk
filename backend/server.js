const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Profile = require('./models/Profile');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});
app.post('/api/profile', async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    res.status(201).json({ 
      success: true, 
      data: profile,
      message: 'Profile created successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});
app.get('/api/profile/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: 'Profile not found' 
      });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json({ 
      success: true, 
      count: profiles.length,
      data: profiles 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});


app.put('/api/profile/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: 'Profile not found' 
      });
    }
    res.json({ 
      success: true, 
      data: profile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.delete('/api/profile/:id', async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: 'Profile not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Profile deleted successfully' 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});


app.get('/api/projects', async (req, res) => {
  try {
    const { skill } = req.query;
    
    const profiles = await Profile.find().select('name projects');
    
    
    const allProjects = [];
    profiles.forEach(profile => {
      profile.projects.forEach(project => {
        
        if (skill) {
          
          const hasTechnology = project.technologies && 
            project.technologies.some(tech => 
              tech.toLowerCase().includes(skill.toLowerCase())
            );
          
          if (hasTechnology) {
            allProjects.push({
              ...project.toObject(),
              profileName: profile.name,
              profileId: profile._id
            });
          }
        } else {
        
          allProjects.push({
            ...project.toObject(),
            profileName: profile.name,
            profileId: profile._id
          });
        }
      });
    });
    
    res.json({ 
      success: true, 
      count: allProjects.length,
      filter: skill ? `skill=${skill}` : 'all',
      data: allProjects 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.get('/api/skills/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Profile.aggregate([
      { $unwind: '$skills' },
      { $group: { 
          _id: '$skills', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $project: { 
          skill: '$_id', 
          count: 1, 
          _id: 0 
        } 
      }
    ]);
    
    res.json({ 
      success: true, 
      count: result.length,
      data: result 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});


app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter "q" is required' 
      });
    }
    
    const profiles = await Profile.find({
      $or: [
        { name: { $regex: new RegExp(q, 'i') } },
        { email: { $regex: new RegExp(q, 'i') } },
        { skills: { $regex: new RegExp(q, 'i') } },
        { 'projects.title': { $regex: new RegExp(q, 'i') } },
        { 'projects.description': { $regex: new RegExp(q, 'i') } }
      ]
    });
    
    res.json({ 
      success: true, 
      query: q,
      count: profiles.length,
      data: profiles 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
