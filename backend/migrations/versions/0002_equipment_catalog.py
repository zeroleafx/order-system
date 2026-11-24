"""Add the equipment catalog."""

import sqlalchemy as sa
from alembic import op


revision = "0002_equipment"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "equipment",
        sa.Column("equipment_id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("category", sa.String(length=100), nullable=False),
        sa.Column("daily_rate", sa.Integer(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("is_listed", sa.Boolean(), server_default="1", nullable=False),
        sa.CheckConstraint("daily_rate >= 0", name="ck_equipment_daily_rate"),
    )


def downgrade():
    op.drop_table("equipment")
