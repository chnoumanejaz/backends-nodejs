const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

//@desc GET all the contacts
//@route GET /api/v1/contacts
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//@desc Create new contact
//@route POST /api/v1/contacts
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error('Fill all data');
  }

  const contact = await Contact.create({
    user_id: req.user.id,
    name,
    email,
    phone,
  });
  res.status(201).json(contact);
});

//@desc GET Contact by id
//@route GET /api/v1/contacts/:id
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('No Contact found!');
  }
  res.status(200).json(contact);
});

//@desc delete the contact
//@route DELETE /api/v1/contacts/:id
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('No Contact found!');
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to delete other users contact");
  }

  await Contact.deleteOne({ _id: req.params.id });
  res.status(201).json({
    message: 'Contact deleted Successfully!',
  });
});

//@desc Update the contact
//@route PUT /api/v1/contacts/:id
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('No Contact found!');
  }
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error(
      "User don't have permissions to update other users contact"
    );
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
