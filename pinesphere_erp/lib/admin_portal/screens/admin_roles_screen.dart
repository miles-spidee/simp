import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinesphere_erp/core/theme/app_colors.dart';
import 'package:pinesphere_erp/core/widgets/error_state_widget.dart';
import 'package:pinesphere_erp/shared/models/admin_models.dart';
import 'package:pinesphere_erp/shared/services/admin_service.dart';

class AdminRolesScreen extends ConsumerStatefulWidget {
  const AdminRolesScreen({super.key});

  @override
  ConsumerState<AdminRolesScreen> createState() => _AdminRolesScreenState();
}

class _AdminRolesScreenState extends ConsumerState<AdminRolesScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _openCreateWizard([RoleModel? roleToEdit, bool viewMode = false]) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => _CreateRoleWizardSheet(
        roleToEdit: roleToEdit,
        viewMode: viewMode,
      ),
    );
  }

  Future<void> _handleDelete(RoleModel role) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Role', style: TextStyle(fontWeight: FontWeight.bold)),
        content: Text('Are you sure you want to delete role "${role.name}"? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: AppColors.slate500)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error, foregroundColor: Colors.white),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      await ref.read(adminRolesProvider.notifier).deleteRole(role.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Role "${role.name}" deleted successfully.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final rolesAsync = ref.watch(adminRolesProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.menu_rounded, color: AppColors.slate800),
          onPressed: () => ref.read(adminScaffoldKeyProvider).currentState?.openDrawer(),
        ),
        title: const Text(
          'Roles',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 17,
            color: AppColors.slate800,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: TextButton.icon(
              onPressed: () => _openCreateWizard(),
              icon: const Icon(Icons.add_rounded, size: 16),
              label: const Text('Create Role'),
              style: TextButton.styleFrom(
                foregroundColor: AppColors.primaryBlue,
                textStyle: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
        shape: const Border(
          bottom: BorderSide(color: Color(0xFFE2E8F0), width: 1),
        ),
      ),
      body: Column(
        children: [
          // Search box
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
            child: TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Search roles...',
                prefixIcon: const Icon(Icons.search_rounded, color: AppColors.slate400, size: 20),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear_rounded, color: AppColors.slate400, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                        },
                      )
                    : null,
                contentPadding: const EdgeInsets.symmetric(vertical: 0, horizontal: 16),
                filled: true,
                fillColor: const Color(0xFFF1F5F9),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          Expanded(
            child: rolesAsync.when(
              loading: () => const Center(
                child: CircularProgressIndicator(color: AppColors.primaryBlue),
              ),
              error: (err, stack) => ErrorStateWidget(
                title: 'Unable to fetch roles',
                error: err,
                onRetry: () => ref.invalidate(adminRolesProvider),
              ),
              data: (roles) {
                final filtered = roles.where((r) {
                  final q = _searchQuery.toLowerCase();
                  return r.name.toLowerCase().contains(q) ||
                      r.code.toLowerCase().contains(q) ||
                      r.desc.toLowerCase().contains(q);
                }).toList();

                if (filtered.isEmpty) {
                  return const Center(
                    child: Text(
                      'No roles found.',
                      style: TextStyle(color: AppColors.slate400, fontSize: 13),
                    ),
                  );
                }

                return RefreshIndicator(
                  color: AppColors.primaryBlue,
                  onRefresh: () async => ref.read(adminRolesProvider.notifier).load(),
                  child: ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
                    itemCount: filtered.length,
                    itemBuilder: (ctx, i) => _RoleCard(
                      role: filtered[i],
                      onView: () => _openCreateWizard(filtered[i], true),
                      onEdit: () => _openCreateWizard(filtered[i], false),
                      onDelete: () => _handleDelete(filtered[i]),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _RoleCard extends ConsumerWidget {
  final RoleModel role;
  final VoidCallback onView;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const _RoleCard({
    required this.role,
    required this.onView,
    required this.onEdit,
    required this.onDelete,
  });

  Color _getRoleColor(String code) {
    if (code.contains('STUDENT')) return const Color(0xFF10B981);
    if (code.contains('MENTOR')) return const Color(0xFFF59E0B);
    if (code.contains('HR')) return const Color(0xFFEF4444);
    if (code.contains('CC')) return const Color(0xFF8B5CF6);
    if (code.contains('MANAGER')) return const Color(0xFFF97316);
    if (code.contains('FINANCE')) return const Color(0xFF6366F1);
    return AppColors.primaryBlue;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final color = _getRoleColor(role.code);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.slate100),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  role.name,
                  style: TextStyle(
                    color: color,
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              if (role.status == 'Inactive')
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.slate100,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Text(
                    'Inactive',
                    style: TextStyle(color: AppColors.slate500, fontSize: 10, fontWeight: FontWeight.w600),
                  ),
                ),
              const Spacer(),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: const Icon(Icons.remove_red_eye_outlined, size: 18, color: AppColors.slate500),
                    visualDensity: VisualDensity.compact,
                    onPressed: onView,
                    tooltip: 'View Permissions',
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit_outlined, size: 18, color: AppColors.slate500),
                    visualDensity: VisualDensity.compact,
                    onPressed: onEdit,
                    tooltip: 'Edit Role',
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline_rounded, size: 18, color: AppColors.error),
                    visualDensity: VisualDensity.compact,
                    onPressed: onDelete,
                    tooltip: 'Delete Role',
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            role.code,
            style: const TextStyle(
              color: AppColors.slate400,
              fontSize: 11,
              fontFamily: 'monospace',
            ),
          ),
          const SizedBox(height: 8),
          Text(
            role.desc,
            style: const TextStyle(color: AppColors.slate600, fontSize: 13),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Row(
                children: [
                  const Icon(Icons.view_module_rounded, size: 14, color: AppColors.slate400),
                  const SizedBox(width: 4),
                  Text(
                    '${role.modulesCount} Modules',
                    style: const TextStyle(color: AppColors.slate600, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
              const SizedBox(width: 24),
              Row(
                children: [
                  const Icon(Icons.people_rounded, size: 14, color: AppColors.slate400),
                  const SizedBox(width: 4),
                  Text(
                    '${role.usersCount} Users',
                    style: const TextStyle(color: AppColors.slate600, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _CreateRoleWizardSheet extends ConsumerStatefulWidget {
  final RoleModel? roleToEdit;
  final bool viewMode;

  const _CreateRoleWizardSheet({
    this.roleToEdit,
    this.viewMode = false,
  });

  @override
  ConsumerState<_CreateRoleWizardSheet> createState() => _CreateRoleWizardSheetState();
}

class _CreateRoleWizardSheetState extends ConsumerState<_CreateRoleWizardSheet> {
  int _currentStep = 0;
  final _formKey = GlobalKey<FormState>();

  // Step 1: Details
  late final TextEditingController _nameCtrl;
  late final TextEditingController _codeCtrl;
  late final TextEditingController _descCtrl;
  String _status = 'Active';

  // Step 2: Modules & Permissions
  final List<String> _allModules = ['identity', 'employee', 'organization', 'program', 'mentor', 'task'];
  final Map<String, List<String>> _modulePermissions = {
    'identity': ['view', 'manage_users', 'manage_roles'],
    'employee': ['view', 'create', 'edit'],
    'organization': ['view', 'create', 'edit'],
    'program': ['view', 'create', 'edit'],
    'mentor': ['view', 'assign'],
    'task': ['view', 'submit', 'review', 'evaluate'],
  };

  final List<String> _selectedModules = [];
  final Map<String, List<String>> _selectedPermissions = {};

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.roleToEdit?.name ?? '');
    _codeCtrl = TextEditingController(text: widget.roleToEdit?.code ?? 'ROLE_');
    _descCtrl = TextEditingController(text: widget.roleToEdit?.desc ?? '');
    _status = widget.roleToEdit?.status ?? 'Active';

    if (widget.roleToEdit != null) {
      _selectedModules.addAll(widget.roleToEdit!.moduleIds);
      for (var perm in widget.roleToEdit!.permissions) {
        if (perm == 'all') {
          // Grant all
          for (var mod in _allModules) {
            _selectedPermissions[mod] = List.from(_modulePermissions[mod]!);
          }
          break;
        }
        final parts = perm.split('.');
        if (parts.length == 2) {
          final mod = parts[0];
          final action = parts[1];
          _selectedPermissions.putIfAbsent(mod, () => []).add(action);
        }
      }
      if (widget.viewMode) {
        _currentStep = 2; // Directly show review tab
      }
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _codeCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep == 0) {
      if (_formKey.currentState?.validate() ?? false) {
        setState(() => _currentStep = 1);
      }
    } else if (_currentStep == 1) {
      setState(() => _currentStep = 2);
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  Future<void> _submit() async {
    final permissionsList = <String>[];
    if (_codeCtrl.text.trim() == 'ROLE_ADMIN') {
      permissionsList.add('all');
    } else {
      for (var mod in _selectedModules) {
        final actions = _selectedPermissions[mod] ?? [];
        for (var act in actions) {
          permissionsList.add('$mod.$act');
        }
      }
    }

    final data = {
      'name': _nameCtrl.text.trim(),
      'code': _codeCtrl.text.trim(),
      'desc': _descCtrl.text.trim(),
      'status': _status,
      'moduleIds': _selectedModules,
      'permissions': permissionsList,
    };

    if (widget.roleToEdit != null) {
      await ref.read(adminRolesProvider.notifier).editRole(widget.roleToEdit!.id, data);
    } else {
      await ref.read(adminRolesProvider.notifier).addRole(data);
    }

    if (mounted) {
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            widget.roleToEdit != null
                ? 'Role "${_nameCtrl.text}" updated successfully.'
                : 'Role "${_nameCtrl.text}" created successfully.',
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEdit = widget.roleToEdit != null;

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      child: Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          children: [
            // Handle bar
            const SizedBox(height: 12),
            Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.slate200,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 16),

            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  Text(
                    widget.viewMode
                        ? 'Role Details'
                        : (isEdit ? 'Edit System Role' : 'Create System Role'),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.slate800),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: AppColors.slate400),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, color: Color(0xFFE2E8F0)),

            // Wizard steps indicator
            if (!widget.viewMode) _buildStepProgress(),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: _buildStepContent(),
              ),
            ),

            // Navigation buttons
            if (!widget.viewMode) _buildNavigationButtons(),
          ],
        ),
      ),
    );
  }

  Widget _buildStepProgress() {
    return Container(
      color: const Color(0xFFF8FAFC),
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _stepIndicator(0, 'Details'),
          _stepLine(),
          _stepIndicator(1, 'Registry'),
          _stepLine(),
          _stepIndicator(2, 'Review'),
        ],
      ),
    );
  }

  Widget _stepIndicator(int stepIndex, String title) {
    final isActive = _currentStep == stepIndex;
    final isDone = _currentStep > stepIndex;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: isDone
                ? AppColors.primaryBlue
                : (isActive ? AppColors.primaryBlue.withValues(alpha: 0.1) : Colors.white),
            shape: BoxShape.circle,
            border: Border.all(
              color: (isActive || isDone) ? AppColors.primaryBlue : AppColors.slate300,
              width: 1.5,
            ),
          ),
          alignment: Alignment.center,
          child: isDone
              ? const Icon(Icons.check_rounded, size: 14, color: Colors.white)
              : Text(
                  '${stepIndex + 1}',
                  style: TextStyle(
                    color: isActive ? AppColors.primaryBlue : AppColors.slate500,
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                  ),
                ),
        ),
        const SizedBox(width: 6),
        Text(
          title,
          style: TextStyle(
            color: isActive ? AppColors.slate800 : AppColors.slate400,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _stepLine() {
    return Container(
      width: 32,
      height: 1,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      color: AppColors.slate200,
    );
  }

  Widget _buildStepContent() {
    if (_currentStep == 0) {
      return Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Step 1: Role Details',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.slate800),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _nameCtrl,
              decoration: const InputDecoration(
                labelText: 'Role Name',
                hintText: 'e.g. Finance Manager',
              ),
              validator: (val) {
                if (val == null || val.trim().isEmpty) return 'Please enter role name';
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _codeCtrl,
              decoration: const InputDecoration(
                labelText: 'Role Code',
                hintText: 'e.g. ROLE_FINANCE',
              ),
              validator: (val) {
                if (val == null || val.trim().isEmpty) return 'Please enter role code';
                if (!val.startsWith('ROLE_')) return 'Role code must start with "ROLE_"';
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descCtrl,
              maxLines: 3,
              decoration: const InputDecoration(
                labelText: 'Description',
                hintText: 'Explain responsibilities and module access.',
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              initialValue: _status,
              decoration: const InputDecoration(labelText: 'Status'),
              onChanged: (val) => setState(() => _status = val!),
              items: const [
                DropdownMenuItem(value: 'Active', child: Text('Active')),
                DropdownMenuItem(value: 'Inactive', child: Text('Inactive')),
              ],
            ),
          ],
        ),
      );
    } else if (_currentStep == 1) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Step 2: Module Permissions Registry',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.slate800),
          ),
          const SizedBox(height: 4),
          const Text(
            'Assign modules and define explicit granular permissions.',
            style: TextStyle(color: AppColors.slate400, fontSize: 12),
          ),
          const SizedBox(height: 16),
          for (var mod in _allModules) _buildModulePermissionsRow(mod),
        ],
      );
    } else {
      // Step 2: Review details
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!widget.viewMode)
            const Text(
              'Step 3: Review & Create',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.slate800),
            )
          else
            const Text(
              'Assigned Module Permissions',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.slate800),
            ),
          const SizedBox(height: 16),
          _buildReviewRow('Role Name', _nameCtrl.text),
          _buildReviewRow('Role Code', _codeCtrl.text),
          _buildReviewRow('Status', _status),
          _buildReviewRow('Description', _descCtrl.text.isEmpty ? 'No description provided.' : _descCtrl.text),
          const SizedBox(height: 16),
          const Text(
            'Permissions list:',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.slate700),
          ),
          const SizedBox(height: 8),
          if (_selectedModules.isEmpty)
            const Text('No permissions assigned.', style: TextStyle(color: AppColors.slate400, fontSize: 12))
          else
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.slate100),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  for (var mod in _selectedModules) ...[
                    Text(
                      mod.toUpperCase(),
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppColors.primaryBlue),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      (_selectedPermissions[mod] ?? []).isEmpty
                          ? 'None'
                          : (_selectedPermissions[mod]!).join(', '),
                      style: const TextStyle(color: AppColors.slate700, fontSize: 12),
                    ),
                    const SizedBox(height: 10),
                  ],
                ],
              ),
            ),
        ],
      );
    }
  }

  Widget _buildReviewRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Spacer(), // just matching height
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(color: AppColors.slate400, fontSize: 12, fontWeight: FontWeight.w600),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(color: AppColors.slate800, fontSize: 13, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModulePermissionsRow(String mod) {
    final isChecked = _selectedModules.contains(mod);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isChecked ? const Color(0xFFF8FAFC) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isChecked ? AppColors.primaryBlue.withValues(alpha: 0.15) : AppColors.slate100),
      ),
      child: ExpansionTile(
        key: PageStorageKey(mod),
        shape: const Border(),
        leading: Checkbox(
          value: isChecked,
          onChanged: (val) {
            setState(() {
              if (val == true) {
                _selectedModules.add(mod);
                // Assign View permission by default
                _selectedPermissions[mod] = ['view'];
              } else {
                _selectedModules.remove(mod);
                _selectedPermissions.remove(mod);
              }
            });
          },
        ),
        title: Text(
          mod.toUpperCase(),
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: isChecked ? AppColors.primaryBlue : AppColors.slate800,
            fontSize: 13,
          ),
        ),
        childrenPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        children: [
          if (isChecked)
            Wrap(
              spacing: 8,
              children: _modulePermissions[mod]!.map((permission) {
                final hasPerm = _selectedPermissions[mod]?.contains(permission) ?? false;
                return ChoiceChip(
                  label: Text(
                    permission.replaceAll('_', ' '),
                    style: TextStyle(
                      fontSize: 11,
                      color: hasPerm ? Colors.white : AppColors.slate600,
                    ),
                  ),
                  selected: hasPerm,
                  selectedColor: AppColors.primaryBlue,
                  backgroundColor: const Color(0xFFF1F5F9),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  onSelected: (selected) {
                    setState(() {
                      final list = _selectedPermissions.putIfAbsent(mod, () => []);
                      if (selected) {
                        list.add(permission);
                      } else {
                        list.remove(permission);
                      }
                    });
                  },
                );
              }).toList(),
            )
          else
            const Padding(
              padding: EdgeInsets.only(bottom: 8),
              child: Text(
                'Please assign module first to edit permissions.',
                style: TextStyle(color: AppColors.slate400, fontSize: 11, fontStyle: FontStyle.italic),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildNavigationButtons() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          if (_currentStep > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: _prevStep,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  side: const BorderSide(color: AppColors.slate300),
                ),
                child: const Text('Back', style: TextStyle(color: AppColors.slate600, fontWeight: FontWeight.bold)),
              ),
            ),
          if (_currentStep > 0) const SizedBox(width: 12),
          Expanded(
            child: ElevatedButton(
              onPressed: _currentStep == 2 ? _submit : _nextStep,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                elevation: 0,
              ),
              child: Text(
                _currentStep == 2
                    ? (widget.roleToEdit != null ? 'Save Changes' : 'Create Role')
                    : 'Next',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
