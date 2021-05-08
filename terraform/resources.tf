provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region     = var.region
}

# DATA #

data "aws_availability_zones" "available" {}

# NETWORKING #

resource "aws_vpc" "vpc" {
  cidr_block = var.network_address_space
  tags       = merge(local.mandatory_tags, { Name = "${var.project_name}-VPC" })
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags   = merge(local.mandatory_tags, { Name = "${var.project_name}-IGW" })
}

resource "aws_subnet" "public_subnet" {
  count                   = 3
  cidr_block              = cidrsubnet(var.network_address_space, 8, count.index)
  vpc_id                  = aws_vpc.vpc.id
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[count.index]

  tags = merge(local.mandatory_tags, { Name = "${var.project_name} Public Subnet - ${data.aws_availability_zones.available.names[count.index]}" })
}

resource "aws_subnet" "private_subnet" {
  count             = 3
  cidr_block        = cidrsubnet(var.network_address_space, 8, (count.index + 3))
  vpc_id            = aws_vpc.vpc.id
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = merge(local.mandatory_tags, { Name = "${var.project_name} Private Subnet - ${data.aws_availability_zones.available.names[count.index]}" })
}

# ROUTING #

resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = merge(local.mandatory_tags, { Name = "${var.project_name}-public-rtb" })
}

resource "aws_route_table" "private_rtb" {
  vpc_id = aws_vpc.vpc.id

  tags = merge(local.mandatory_tags, { Name = "${var.project_name}-private-rtb" })
}

resource "aws_route_table_association" "public-rta-subnet" {
  count          = 3
  subnet_id      = aws_subnet.public_subnet[count.index].id
  route_table_id = aws_route_table.public_rtb.id
}

resource "aws_route_table_association" "private-rta-subnet" {
  count          = 3
  subnet_id      = aws_subnet.private_subnet[count.index].id
  route_table_id = aws_route_table.private_rtb.id
}
