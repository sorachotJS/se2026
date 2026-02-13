// src/models/Todo.js
const mongoose = require('mongoose');

/**
 * Todo Schema
 */
const todoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, 'Task is required'],
      trim: true,
      maxlength: [200, 'Task must be less than 200 characters']
    },
    done: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true  // เพิ่ม createdAt และ updatedAt อัตโนมัติ
  }
);

/**
 * Virtual - fullInfo
 * (ไม่เก็บใน database)
 */
todoSchema.virtual('fullInfo').get(function() {
  return `${this.task} [${this.done ? 'Done' : 'Pending'}]`;
});

/**
 * Instance Method - toggle done status
 */
todoSchema.methods.toggleDone = function() {
  this.done = !this.done;
  return this.save();
};

/**
 * Static Method - get statistics
 */
todoSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: ['$done', 1, 0] }
        },
        pending: {
          $sum: { $cond: ['$done', 0, 1] }
        }
      }
    }
  ]);

  return stats[0] || { total: 0, completed: 0, pending: 0 };
};

/**
 * Pre-save Hook
 * (รันก่อน save)
 */
todoSchema.pre('save',async function() {
  console.log('💾 Saving todo:', this.task);
  
});

/**
 * Post-save Hook
 * (รันหลัง save)
 */
todoSchema.post('save', function(doc) {
  console.log('✅ Todo saved:', doc._id);
});

// Export model
module.exports = mongoose.model('Todo', todoSchema);